document.addEventListener(
    "DOMContentLoaded",
    initRegister
);

function initRegister() {

    const form =
        document.getElementById(
            "register-form"
        );

    form.addEventListener(
        "submit",
        handleRegister
    );

}

async function handleRegister(e) {

    e.preventDefault();

    const namaLengkap =
        document
        .getElementById("nama_lengkap")
        .value
        .trim();

    const username =
        document
        .getElementById("username")
        .value
        .trim()
        .toLowerCase();

    const email =
        document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password =
        document
        .getElementById("password")
        .value;

    const konfirmasiPassword =
        document
        .getElementById("confirm_password")
        .value;

    const noTelp =
        document
        .getElementById("no_telp")
        .value
        .trim();

    const tanggalLahir =
        document
        .getElementById("tanggal_lahir")
        .value;

    const jenisKelamin =
        document
        .getElementById("jenis_kelamin")
        .value;

    if (namaLengkap.length < 3) {

        alert(
            "Nama lengkap minimal 3 karakter."
        );

        return;

    }

    const usernameRegex =
        /^[a-z0-9._]+$/;

    if (!usernameRegex.test(username)) {

        alert(
            "Username hanya boleh berisi huruf kecil, angka, titik dan underscore."
        );

        return;

    }

    if (password.length < 8) {

        alert(
            "Password minimal 8 karakter."
        );

        return;

    }

    if (password !== konfirmasiPassword) {

        alert(
            "Konfirmasi password tidak sama."
        );

        return;

    }

    const today =
        new Date();

    const birth =
        new Date(tanggalLahir);

    if (birth > today) {

        alert(
            "Tanggal lahir tidak valid."
        );

        return;

    }

    try {

        await registerUser({

            namaLengkap,
            username,
            email,
            password,
            noTelp,
            tanggalLahir,
            jenisKelamin

        });

        alert(
            "Pendaftaran berhasil.\nSilakan cek email untuk verifikasi akun."
        );

        location.href =
            "login.html";

    }

    catch (error) {

        console.error(error);

        alert(
            error.message
        );

    }

}