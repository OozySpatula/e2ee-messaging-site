import {
    setupAuth
} from "./auth.js";

import {
    setupFriends
} from "./friends.js"

const loginView =
    document.querySelector("#login-view");


const registerView =
    document.querySelector("#register-view");

const loginForm =
    document.querySelector("#login-form");

const registerForm =
    document.querySelector("#register-form");

const loginMessage =
    document.querySelector("#login-message");

const registerMessage =
    document.querySelector("#register-message");
    


document
    .querySelector("#show-register")
    .addEventListener(
        "click",
        () => {

            loginView.hidden = true;
            loginForm.reset();
            loginMessage.textContent = "";

            registerView.hidden = false;

        }
    );



document
    .querySelector("#show-login")
    .addEventListener(
        "click",
        () => {

            registerView.hidden = true;
            registerForm.reset();
            registerMessage.textContent = "";

            loginView.hidden = false;

        }
    );



setupAuth();
setupFriends();