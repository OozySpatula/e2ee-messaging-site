import {
    validateUsername,
    validatePassword
} from "./validators.js";


export function setupAuth() {


    const loginForm =
        document.querySelector("#login-form");


    const registerForm =
        document.querySelector("#register-form");


    const loginMessage =
        document.querySelector("#login-message");


    const registerMessage =
        document.querySelector("#register-message");



    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            loginMessage.textContent = "";


            const username =
                loginForm.username.value.trim();


            const password =
                loginForm.password.value;



            if (!username || !password) {

                loginMessage.textContent =
                    "Please enter your credentials.";

                return;
            }


            loginMessage.textContent =
                "Login validation passed.";

            loginMessage.className =
                "message success";


            // TODO:
            // fetch("/api/login")
        }
    );



    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            registerMessage.textContent = "";


            const username =
                registerForm.username.value.trim();


            const password =
                registerForm.password.value;


            const confirm =
                registerForm.confirm.value;



            if (!validateUsername(username)) {

                registerMessage.textContent =
                    "Invalid username.";

                return;
            }



            if (!validatePassword(password)) {

                registerMessage.textContent =
                    "Password does not meet requirements.";

                return;
            }



            if (password !== confirm) {

                registerMessage.textContent =
                    "Passwords do not match.";

                return;
            }



            registerMessage.textContent =
                "Registration validation passed.";

            registerMessage.className =
                "message success";


            // TODO:
            // fetch("/api/register")

        }
    );

}