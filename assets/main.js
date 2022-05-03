import FormValidator from "./controllers/FormValidator";

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
    const VALIDATOR = new FormValidator("validator", "submit");
    VALIDATOR.init();
});