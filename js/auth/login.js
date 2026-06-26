document.addEventListener(
    "DOMContentLoaded",
    initLogin
);

function initLogin(){

    // --- CHECK FLASH MESSAGE DARI SESSION STORAGE ---
    const message =
        sessionStorage.getItem(
            "authMessage"
        );

    if(message){

        // Cek apakah fungsi showInfo tersedia, jika tidak gunakan alert sebagai fallback
        if (typeof showInfo === "function") {
            showInfo(message);
        } else {
            alert(message);
        }

        // Hapus segera agar pesan tidak muncul berulang kali saat di-refresh
        sessionStorage.removeItem(
            "authMessage"
        );
    }

    const form =
        document.getElementById(
            "login-form"
        );

    // Antisipasi jika form tidak ditemukan di HTML agar tidak crash
    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handleLogin
    );

}

async function handleLogin(event){

    event.preventDefault();

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

        await loginUser(
            email,
            password
        );

        alert(
            "Login berhasil."
        );

        // Mendapatkan URL tujuan secara dinamis
        const redirect = getRedirectUrl();

        window.location.href = redirect;

    }
    catch(error){

        console.error(error);

        alert(
            error.message
        );

    }

}

/**
 * Mengambil URL pengalihan dari parameter query 'redirect' di address bar.
 * Contoh: /auth/login.html?redirect=/pages/bookmark.html
 * @returns {string} Target URL pengalihan atau halaman utama sebagai fallback
 */
function getRedirectUrl() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const targetRedirect = urlParams.get("redirect");

        // Jika ada parameter redirect, gunakan itu. Jika tidak, arahkan ke beranda index.html
        return targetRedirect ? decodeURIComponent(targetRedirect) : "/index.html";
    } 
    catch (error) {
        console.error("Gagal memproses redirect URL:", error);
        return "/index.html";
    }
}