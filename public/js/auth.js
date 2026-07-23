import {
    validateUsername,
    validatePassword
} from "./validators.js";

import {
    register,
    login,
    getMe
} from "./api.js";

import { setupFriends } from "./friends.js";


export async function setupAuth() {

    const loginForm =
        document.querySelector("#login-form");

    const registerForm =
        document.querySelector("#register-form");

    const loginMessage =
        document.querySelector("#login-message");

    const registerMessage =
        document.querySelector("#register-message");
    
    const dashboardView =
        document.querySelector("#dashboard-view");

    const dashboardUsername =
        document.querySelector("#dashboard-username");

    const dashboardUserId =
        document.querySelector("#dashboard-user-id");

    const loginView =
        document.querySelector("#login-view");
    
    const registerView =
        document.querySelector("#register-view");
    
    const authCard =
        document.querySelector("#auth-card");

    async function showDashboard(user) {

        authCard.hidden = true;

        dashboardView.hidden = false;

        dashboardUsername.textContent =
            user.username;

        dashboardUserId.textContent =
            user.id;

        await setupFriends();
    }

    try {

        const result =
            await getMe();

        await showDashboard(result.user);

    } catch {

        // Not logged in
        authCard.hidden = false;
        dashboardView.hidden = true;

    }

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
                
                loginForm.reset();

                loginMessage.textContent = "";

                await showDashboard(result.user);

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