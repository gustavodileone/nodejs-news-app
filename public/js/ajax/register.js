const registerFormContainer = document.getElementById("register-form-container");
const registerForm = document.getElementById("register-form");
const registerEmailVerification = document.getElementById("email-verification");
const username = document.getElementById("register-username");
const email = document.getElementById("register-email");
const password = document.getElementById("register-password");

const btnContinue = document.getElementById("button-continue");

btnContinue.onclick = async e => {
    e.preventDefault();

    fetch("/_ajax/send-email-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username.value}&email=${email.value}&password=${password.value}`
    }).then(response => {
        response = response.json();

        if(response.result) {
            return;
        }

        registerForm.remove();

        const content = registerEmailVerification.content.cloneNode(true);
        registerFormContainer.appendChild(content);
    })
}