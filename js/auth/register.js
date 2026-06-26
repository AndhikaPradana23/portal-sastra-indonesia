document.addEventListener(
    "DOMContentLoaded",
    initRegister
);

function initRegister(){

    const form =
        document.getElementById(
            "register-form"
        );

    form.addEventListener(
        "submit",
        handleRegister
    );

}

async function handleRegister(e){

    e.preventDefault();

    const nama =
        document
            .getElementById("nama")
            .value
            .trim();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    try{

        await registerUser(
            nama,
            email,
            password
        );

        alert(
            "Pendaftaran berhasil. Silakan cek email untuk verifikasi akun."
        );

        location.href =
            "login.html";

    }
    catch(error){

        console.error(error);

        alert(
            error.message
        );

    }

}