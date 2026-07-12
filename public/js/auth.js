import {
    validateUsername,
    validatePassword
} from "./validators.js";

import {
    register,
    login
} from "./api.js";


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
        async event => {

            event.preventDefault();

            loginMessage.textContent = "";
            loginMessage.className = "message";

            const username =
                loginForm.username.value.trim();

            const password =
                loginForm.password.value;


            if (!username || !password) {

                loginMessage.textContent =
                    "Please enter your credentials.";

                loginMessage.className =
                    "message error";

                return;

            }


            try {

                const result =
                    await login(
                        username,
                        password
                    );

                loginMessage.textContent =
                    result.message;

                loginMessage.className =
                    "message success";

            } catch (error) {

                loginMessage.textContent =
                    error.message;

                loginMessage.className =
                    "message error";

            }

        }
    );


    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            registerMessage.textContent = "";
            registerMessage.className = "message";

            const username =
                registerForm.username.value.trim();

            const password =
                registerForm.password.value;

            const confirm =
                registerForm.confirm.value;


            if (!validateUsername(username)) {

                registerMessage.textContent =
                    "Invalid username.";

                registerMessage.className =
                    "message error";

                return;

            }


            if (!validatePassword(password)) {

                registerMessage.textContent =
                    "Password does not meet requirements.";

                registerMessage.className =
                    "message error";

                return;

            }


            if (password !== confirm) {

                registerMessage.textContent =
                    "Passwords do not match.";

                registerMessage.className =
                    "message error";

                return;

            }


            try {

                const result =
                    await register(
                        username,
                        password
                    );

                registerMessage.textContent =
                    result.message;

                registerMessage.className =
                    "message success";

                registerForm.reset();

            } catch (error) {

                registerMessage.textContent =
                    error.message;

                registerMessage.className =
                    "message error";

            }

        }
    );

}