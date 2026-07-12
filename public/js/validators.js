export function validateUsername(username) {

    return /^[a-zA-Z0-9_]{3,20}$/.test(username);

}


export function validatePassword(password) {

    return (
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );

}