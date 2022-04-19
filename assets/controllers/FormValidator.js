import Validator from "./Validator";

export default class FormValidator {
    VALIDATOR = null;
    target = null;
    submitButton = null;
    curType = null;
    acceptedTypes = null;
    timeout = null;
    hasLostFocus = null;
    debug = false;
    fieldTypes = [
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

    constructor(formID = "validator", submitID = "submit", enableDebug = false){
        this.VALIDATOR = new Validator();
        this.debug = enableDebug;
        this.target = document.querySelector("#" + formID);
        this.submitButton = target.querySelector("#" + submitID);
        this.init();
    }

    init(){
        this.target.addEventListener("focusout", function (e) {
            /**
             * Perform this action only if the field is pristine
             */
            this.hasLostFocus = e.target.getAttribute("data-focus-lost");
            if (!this.hasLostFocus) {
                this.curType = e.target.type;
                if (this.fieldTypes.indexOf(this.curType) > -1) {
                    this.validateForm(e.target);
                    e.target.setAttribute("data-focus-lost", "true");
                }
            }
        });
    
        this.target.addEventListener("keyup", function (e) {
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
                this.timeout = setTimeout(function () {
                    this.curType = e.target.type;
                    if (this.fieldTypes.indexOf(this.curType) > -1) {
                        this.validateForm(e.target);
                    }
                }, 550);
            }
        });
    
        this.submitButton.addEventListener("click", function(e){
            if(!window.validator.isFormValid){
                e.preventDefault();
            }
        });
    }

    displayErrorAlert(target, errorMessage) {
        let alert = target.parentNode.querySelector(".alert");
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
    
    removeAlert(target) {
        let alert = target.parentNode.querySelector(".alert");
        if (alert) {
            let alertType = alert.getAttribute("data-alert-type");
            switch (alertType) {
                case "error":
                    target.parentNode.querySelector(".alert-danger").remove();
                    break;
            }
        }
    }

    validateForm(target){
        if (this.fieldTypes.indexOf(curType) > -1) {
            if (this.curType === "file" || this.curType === "image") {
                this.acceptedTypes = target.getAttribute("accept");
            } else {
                this.acceptedTypes = target.getAttribute("data-accepted");
                if(!this.acceptedTypes){
                    if(this.debug){
                        target.setAttribute("style", "border:2px dashed red;");
                    }
                    console.error(`[Validator]-[Missing parameter] - No data-accepted attribute defined for the element: 
                    ${target.outerHTML}`);
                    return;
                }
            }

            let error = this.VALIDATOR.validate(target.value, acceptedTypes);
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