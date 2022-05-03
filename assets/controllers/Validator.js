import Dinero from "dinero.js";
import moment from "moment";
import {dateModel} from "../models/date.model";
/**
 * This class can be used to validate form values
 * or any value if needed.
 * 
 * Rules can be passed manually or via data attributes.
 * 
 * For example:
 * <input type="text" data-accepted="string">
 * <input type="text" data-accepted="string,float,integer">
 * Or:
 * var x = Validator.validate(value, "array");
 */
export default class Validator {

    constructor() {
        this.types = [
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
        this.mimeTypes = [
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
        //Locales
        //this.currentCurrency = document.documentElement.getAttribute("data-currency");
        this.currentLocale = document.documentElement.getAttribute("data-locale").replace("_", "-");
        //Regexes
        this.stringRegex = /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]+)$/;
        this.textFieldRegex = /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-?^;:,!"'£$€%&/()=*#@<>°ìùèéòàç]+)$/;
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