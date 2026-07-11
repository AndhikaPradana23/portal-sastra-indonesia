// Regex untuk validasi format username (huruf kecil, angka, titik, dan underscore)
const usernameRegex = /^[a-z0-9._]+$/;

// State global untuk melacak ketersediaan username
let usernameValid = false;

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

    // Tambahkan pengecekan realtime saat user mengetik username
    const usernameInput = document.getElementById("username");
    usernameInput.addEventListener(
        "input",
        checkUsernameAvailability
    );
}

async function checkUsernameAvailability() {
    const username =
        document
        .getElementById("username")
        .value
        .trim()
        .toLowerCase();

    const feedback =
        document.getElementById(
            "username-feedback"
        );

    // Jika input kurang dari 3 karakter, bersihkan feedback
    if (username.length < 3) {
        feedback.className = "field-feedback";
        feedback.textContent = "";
        usernameValid = false;
        return;
    }

    // Validasi format menggunakan regex sebelum mengecek ke database
    if (!usernameRegex.test(username)) {
        feedback.className = "field-feedback error";
        feedback.textContent = "Format tidak valid (gunakan huruf kecil, angka, titik, atau underscore).";
        usernameValid = false;
        return;
    }

    try {
        // Menggunakan RPC Supabase untuk efisiensi, keamanan RLS, dan proteksi privasi tabel profiles
        const { data: isExists, error } = await supabaseClient.rpc(
            "username_exists",
            { p_username: username }
        );

        if (error) throw error;

        if (isExists) {
            feedback.className = "field-feedback error";
            feedback.textContent = "Username sudah digunakan. Silakan gunakan username lain.";
            usernameValid = false;
        } else {
            feedback.className = "field-feedback success";
            feedback.textContent = "Username tersedia.";
            usernameValid = true;
        }
    } catch (error) {
        console.error("Gagal memeriksa username:", error);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    // Validasi pengecekan realtime sebelum proses registrasi dilanjutkan
    if (!usernameValid) {
        alert(
            "Silakan gunakan username yang belum dipakai."
        );
        return;
    }

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
        document.querySelector('input[name="jenis_kelamin"]:checked'
        )?.value;

    if (namaLengkap.length < 3) {
        alert(
            "Nama lengkap minimal 3 karakter."
        );
        return;
    }

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

    if (!jenisKelamin) {
        alert(
            "Silakan pilih jenis kelamin."
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