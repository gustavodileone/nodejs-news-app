const registerFormContainer = document.getElementById("register-form-container");
const registerForm = document.getElementById("register-form");
const registerEmailVerification = document.getElementById("email-verification");
const username = document.getElementById("register-username");
const email = document.getElementById("register-email");
const password = document.getElementById("register-password");

const btnContinue = document.getElementById("button-continue");

btnContinue.onclick = async e => {
    e.preventDefault();

    username.value = username.value.trim();
    email.value = email.value.trim();

    let emptyFields = 0;

    if(!username.value) {
        username.style.border = "1px solid red";
        emptyFields++;
    }

    if(!email.value) {
        email.style.border = "1px solid red";
        emptyFields++;
    }

    if(!password.value) {
        password.style.border = "1px solid red";
        emptyFields++;
    }

    if(emptyFields !== 0) return false;

    fetch("/email-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username.value}&email=${email.value}&password=${password.value}`
    }).then(response => {
        response = response.json();

        if(response.result) 
            return;
        
        registerForm.remove();

        const content = registerEmailVerification.content.cloneNode(true);
        registerFormContainer.appendChild(content);
    })
}