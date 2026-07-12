import {
    setupAuth
} from "./auth.js";


const loginView =
    document.querySelector("#login-view");


const registerView =
    document.querySelector("#register-view");



document
    .querySelector("#show-register")
    .addEventListener(
        "click",
        () => {

            loginView.hidden = true;

            registerView.hidden = false;

        }
    );



document
    .querySelector("#show-login")
    .addEventListener(
        "click",
        () => {

            registerView.hidden = true;

            loginView.hidden = false;

        }
    );



setupAuth();