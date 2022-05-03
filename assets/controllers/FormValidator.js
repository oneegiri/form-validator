import Validator from "./Validator";

export default class FormValidator {

    constructor(
        formID = "validator",
        submitID = "submit"
    ) {
        this.VALIDATOR = new Validator();
        this.target = document.body.querySelector("#" + formID);
        this.submitButton = this.target.querySelector("#" + submitID);
        this.curType = null;
        this.acceptedTypes = null;
        this.timeout = null;
        this.hasLostFocus = null;
        this.fieldTypes = [
            "file",
            "text",
            "number",
            "email",
            "password",
            "date",
            "checkbox",
            "tel",
            "time",
            "hidden",
            "image",
        ];
    }

    /**
     * Add the required listeners to the
     * current form.
     */
    init() {
        this.target.addEventListener("focusout", (e) => { // focusout bubbles up whilist blur doesn't
            /**
             * Perform this action only if the field is pristine
             */
            this.hasLostFocus = e.target.getAttribute("data-focus-lost");
            if (!this.hasLostFocus) {
                this.curType = e.target.type;
                if (this.fieldTypes.indexOf(this.curType) > -1) {
                    this.validateForm(e.target, this.curType);
                    e.target.setAttribute("data-focus-lost", "true");
                }
            }
        });

        this.target.addEventListener("keyup", (e) => {
            /**
             * Perform this action only if the form has already
             * been edited.
             */
            this.hasLostFocus = e.target.getAttribute("data-focus-lost");
            if (this.hasLostFocus) {
                // Clear the timeout if it has already been set.
                // This will prevent the previous task from executing
                // if it has been less than <MILLISECONDS>
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in x milliseconds
                this.timeout = setTimeout(() => {
                    this.curType = e.target.type;
                    if (this.fieldTypes.indexOf(this.curType) > -1) {
                        this.validateForm(e.target, this.curType);
                    }
                }, 550);
            }
        });

        this.submitButton.addEventListener("click", (e) => {
            if (!window.validator.isFormValid) {
                e.preventDefault();
            }
        });
    }

    /**
     * Display an alert message if
     * the field is invalid.
     * @param {*} target 
     * @param {string} errorMessage 
     */
    displayErrorAlert(target, errorMessage) {
        let alert = target.parentNode.querySelector(".alert");
        //Check if there is already an alert message
        if (!alert) {
            let message = document.createElement("div");
            message.classList.add("alert");
            message.classList.add("alert-danger");
            message.setAttribute("role", "alert");
            message.setAttribute("data-alert-type", "error");
            message.textContent = errorMessage;
            target.insertAdjacentElement("afterend", message);
        }
    }

    /**
     * Remove an alert message if the
     * field has been corrected.
     * @param {*} target 
     */
    removeAlert(target) {
        let alert = target.parentNode.querySelector(".alert");
        //Check if there is an alert message to remove
        if (alert) {
            let alertType = alert.getAttribute("data-alert-type");
            switch (alertType) {
                case "error":
                    target.parentNode.querySelector(".alert-danger").remove();
                    break;
            }
        }
    }

    /**
     * Validate the form on focusout or keyup
     * @param {*} target 
     * @param {string} type
     */
    validateForm(target, type) {
        /**
         * If the input type is present
         * inside the list, validate it.
         */
        if (this.fieldTypes.indexOf(type) > -1) {
            if (type === "file" || type === "image") {
                /**
                 * Type file and image should always have the [accept] attribute
                 * to restrict which file are allowed to be uploaded.
                 */
                this.acceptedTypes = target.getAttribute("accept");
            } else {
                this.acceptedTypes = target.getAttribute("data-accepted");
                /**
                 * If there is no [data-accepted] attribute
                 * on the field, trigger an error.
                 */
                if (!this.acceptedTypes) {
                    /**
                     * If the debug mode is activated, mark the affected
                     * fields in order to recognize them.
                     */
                    if (this.debug) {
                        target.setAttribute("style", "border:2px dashed red;");
                    }

                    console.error(`[Validator]-[Missing parameter] - No data-accepted attribute defined for the element: ${target.outerHTML}`);
                    return;
                }
            }

            let error = this.VALIDATOR.validate(target.value, this.acceptedTypes);
            
            if (error.errMessage) {
                this.displayErrorAlert(target, error.errMessage);
                this.submitButton.setAttribute("disabled", "true");
            } else {
                this.removeAlert(target);
                this.submitButton.removeAttribute("disabled");
            }
        }
    }
}