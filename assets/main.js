//import Validator from "./controllers/Validator";
//import dateModel from "./models/date.model";

class Validator {
    currencyValidator;
    currentLocale;
    currentCurrency;
    errors;
    emailRegex;
    dateRegex;
    dateTimeRegex;
    telephoneNumberRegex;
    types = [
        "string",
        "integer",
        "float",
        "boolean",
        "date",
        "datetime",
        "currency",
        "object",
        "mimetype",
        "telephone",
        "email",
        "currency",
        "array",
    ];
    mimeTypes = [
        '.csv',
        ".xml",
        ".doc",
        ".docx",
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".json",
        ".avi",
        ".ppt",
        ".pptx",
        ".rtf",
        ".txt",
        ".xls",
        ".xlsx",
        ".json",
    ];

    constructor() {
        //Locales
        //this.currentCurrency = document.documentElement.getAttribute("data-currency");
        this.currentLocale = document.documentElement.getAttribute("data-locale");
        //Regexes
        this.stringRegex = /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]+)$/;
        this.dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        this.telephoneNumberRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //Currency
        //this.currencyValidator = Dinero;
        //this.currencyValidator.globalLocale = this.currentLocale.replace("_", "-");
        //this.currencyValidator.defaultCurrency = this.currentCurrency;
        //this.currencyValidator.defaultPrecision = 2;
        //Errors
        this.errors = {};
        window.validator = {};
    }

    /**
     * Validate the provided input and
     * return back an error, if the provided
     * rules are not met.
     * @param {string} value 
     * @param {array} rules 
     */
    validate(value, rules) {
        //Clean the errors object
        this.errors = {};

        /*
         * Check if the value is not empty 
         * before trying to validate it.
         */
        if (value !== "" || value !== null || value !== undefined) {
            let rulesArray = rules.split(",");
            this.applyRules(value, rulesArray);
        }
        return this.errors;
    }
    /**
     * Checks if the provided value
     * is a valid string.
     * @param {*} value 
     */
    isStringValid(value) {
        if ("string" !== typeof value || !value.match(this.stringRegex)) {
            this.errors.errMessage = "You must provide a valid string.";
        }
    }
    /**
     * Checks if the provided value
     * is a valid amount based on
     * the current locale and currency.
     * @param {*} value 
     */
    isCurrencyValid(value) {
        /*let formattedCurrency = this.currencyValidator({
            amount: value
        });

        if (formattedCurrency !== value) {
            this.errors.push({
                message: "You must provide a valid amount."
            });
        }*/
    }
    /**
     * Checks if the provided value is
     * a valid telephone number.
     * @param {*} value 
     */
    /**
     * 
     * #Line start, match any whitespaces at the beginning if any.
        (?:\+?(\d{1,3}))?   #GROUP 1: The country code. Optional.
        [-. (]*             #Allow certain non numeric characters that may appear between the Country Code and the Area Code.
        (\d{3})             #GROUP 2: The Area Code. Required.
        [-. )]*             #Allow certain non numeric characters that may appear between the Area Code and the Exchange number.
        (\d{3})             #GROUP 3: The Exchange number. Required.
        [-. ]*              #Allow certain non numeric characters that may appear between the Exchange number and the Subscriber number.
        (\d{4})             #Group 4: The Subscriber Number. Required.
        (?: *x(\d+))?       #Group 5: The Extension number. Optional.
        \s*$                #Match any ending whitespaces if any and the end of string.} value 
    * it matches
    * 18005551234
        1 800 555 1234
        +1 800 555-1234
        +86 800 555 1234
        1-800-555-1234
        1 (800) 555-1234
        (800)555-1234
        (800) 555-1234
        (800)5551234
        800-555-1234
        800.555.1234
        800 555 1234x5678
        8005551234 x5678
        1    800    555-1234
        1----800----555-1234
     */
    isTelephoneNumberValid(value) {
        if (!value.match(this.telephoneNumberRegex)) {
            this.errors.errMessage = "You must provide a valid telephone number.";
        }
    }
    /**
     * Checks if the provided value
     * is a valid email.
     * @param {*} value 
     */
    isEmailValid(value) {
        if (!value.match(this.emailRegex)) {
            this.errors.errMessage = "You must provide a valid email.";
        }
    }
    /**
     * Checks if the provided value
     * is a valid date.
     * @param {*} value 
     */
    isDateValid(value) {
        if (!moment(value, dateModel[this.currentLocale], true).isValid()) {
            this.errors.errMessage = "You must provide a valid date.";
        }
    }
    /**
     * Checks if the provided value
     * is a valid datetime.
     * 
     * Datetime gets validated via regex to ensure the
     * value matches the standard datetime used in databases YYY-MM-DD HH-MM-SS
     * @param {*} value 
     */
    isDateTimeValid(value) {
        if (!value.match(this.dateTimeRegex)) {
            this.errors.errMessage = "You must provide a valid datetime.";
        }
    }
    /**
     * Checks if the providev value 
     * is a float number.
     * @param {*} value 
     */
    isFloatValid(value) {
        value = value * 1; // => parse to float
        if (Number.isInteger(value) || Number.isSafeInteger(value) || value === 0 || isNaN(value)) {
            this.errors.errMessage = "You must provide floating point number.";
        }
    }
    /**
     * Checks if the provide value
     * is an integer number.
     * @param {*} value 
     */
    isIntegerValid(value) {
        value = value * 1; // => parse to integer
        if (!Number.isInteger(value) || !Number.isSafeInteger(value) || value === 0 || isNaN(value)) {
            this.errors.errMessage = "You must provide a number.";
        }
    }
    /**
     * Checks if the provided value
     * is an object.
     * @param {*} value 
     */
    isObjectValid(value) {
        value = JSON.parse(value);
        if ("object" !== typeof value) {
            this.errors.errMessage = "You must provide an object.";
        }
    }
    /**
     * Checks if the provided value
     * is an array.
     * @param {*} value 
     */
    isArrayValid(value) {
        if ("array" !== typeof value || !isArray(value)) {
            this.errors.errMessage = "You must provide an array.";
        }
    }
    /**
     * Checks if the provided file
     * is a valid and accepted mimetype.
     * @param {*} value 
     */
    isMimeTypeValid(value) {
        if (this.mimeTypes.indexOf(value) === -1) {
            this.errors.errMessage = "You must provide a valid file.";
        }
    }
    /**
     * Checks if the provided value
     * is a boolean.
     * @param {*} value 
     */
    isBoolean(value) {
        if ("boolean" !== typeof value) {
            this.errors.errMessage = "You must provide an object.";
        }
    }

    /**
     * Apply the provided rules.
     * @param {*} value 
     * @param {array} rules 
     */
    applyRules(value, rules) {
        switch (rules.length) {
            case 0:
                console.error(`[Validator]-[Missing rules] - No rules defined for value: ${value}`);
                break;
            case 1:
                let cleanRule = rules[0].toLowerCase().trim();
                this.checkRuleType(value, cleanRule);
                break;
            default:
                rules.forEach(function (rule) {
                    let cleanRule = rule.toLowerCase().trim();
                    this.checkRuleType(value, cleanRule);
                });
                break;
        }
    }

    /**
     * Check if the rule is for a mimetype
     * or for a type, then apply the right
     * method.
     * @param {string} value 
     * @param {string} rule 
     */
    checkRuleType(value, rule) {
        if (this.types.indexOf(rule) > -1) {
            if (rule === "currency") {
                this.isCurrencyValid(value);
            } else {
                switch (rule) {
                    case "string":
                        this.isStringValid(value);
                        break;
                    case "integer":
                        this.isIntegerValid(value);
                        break;
                    case "float":
                        this.isFloatValid(value);
                        break;
                    case "boolean":
                        this.isBoolean(value);
                        break;
                    case "date":
                        this.isDateValid(value);
                        break;
                    case "datetime":
                        this.isDateTimeValid(value);
                        break;
                    case "object":
                        this.isObjectValid(value);
                        break;
                    case "telephone":
                        this.isTelephoneNumberValid(value);
                        break;
                    case "email":
                        this.isEmailValid(value);
                        break;
                    case "array":
                        this.isArrayValid(value);
                        break;
                }
            }
        } else {
            this.isMimeTypeValid(rule);
        }
    }
}

function displayErrorAlert(target, errorMessage) {
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

function removeAlert(target) {
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

document.addEventListener("DOMContentLoaded", function () {
    const target = document.querySelector("#validator");
    const submitButton = target.querySelector("#submit");
    const VALIDATOR = new Validator();
    let curType = null;
    let acceptedTypes = null;
    let timeout = null;
    let debug = true;
    const fieldTypes = [
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
    target.addEventListener("focusout", function (e) {
        /**
         * Perform this action only if the field is pristine
         */
        let hasLostFocus = e.target.getAttribute("data-focus-lost");
        if (!hasLostFocus) {
            curType = e.target.type;
            if (fieldTypes.indexOf(curType) > -1) {
                if (curType === "file" || curType === "image") {
                    acceptedTypes = e.target.getAttribute("accept");
                } else {
                    acceptedTypes = e.target.getAttribute("data-accepted");
                    if(!acceptedTypes){
                        if(debug){
                            e.target.setAttribute("style", "border:2px dashed red;");
                        }
                        console.error(`[Validator]-[Missing parameter] - No data-accepted attribute defined for the element: ${e.target.outerHTML}`);
                        return;
                    }
                }
                let error = VALIDATOR.validate(e.target.value, acceptedTypes);

                console.log(error);

                if (error.errMessage) {
                    displayErrorAlert(e.target, error.errMessage);
                    window.validator.isFomValid = false;
                    submitButton.setAttribute("disabled", "true");
                } else {
                    removeAlert(e.target);
                    window.validator.isFomValid = true;
                    submitButton.removeAttribute("disabled");
                }

                e.target.setAttribute("data-focus-lost", "true");
            }
        }
    });

    target.addEventListener("keyup", function (e) {
        /**
         * Perform this action only if the form has already
         * been edited.
         */
        let hasLostFocus = e.target.getAttribute("data-focus-lost");
        if (hasLostFocus) {
            // Clear the timeout if it has already been set.
            // This will prevent the previous task from executing
            // if it has been less than <MILLISECONDS>
            clearTimeout(timeout);

            // Make a new timeout set to go off in x milliseconds
            timeout = setTimeout(function () {
                curType = e.target.type;
                if (fieldTypes.indexOf(curType) > -1) {
                    if (curType === "file" || curType === "image") {
                        acceptedTypes = e.target.getAttribute("accept");
                    } else {
                        acceptedTypes = e.target.getAttribute("data-accepted");
                    }
                    let error = VALIDATOR.validate(e.target.value, acceptedTypes);

                    if (error.errMessage) {
                        displayErrorAlert(e.target, error.errMessage);
                        submitButton.setAttribute("disabled", "true");
                    } else {
                        removeAlert(e.target);
                        submitButton.removeAttribute("disabled");
                    }
                }
            }, 550);
        }
    });

    submitButton.addEventListener("click", function(e){
        if(!window.validator.isFormValid){
            e.preventDefault();
        }
    });
});