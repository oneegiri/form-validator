import FormValidator from "./controllers/FormValidator";

document.addEventListener("DOMContentLoaded", function () {
    const VALIDATOR = new FormValidator("validator", "submit");
    VALIDATOR.init();
});