// HAPUS: document.addEventListener("DOMContentLoaded", initLogout);
// Karena inisialisasi tombol sekarang dikendalikan secara dinamis oleh auth-ui.js

function initLogout(){

    const button =
        document.getElementById(
            "logout-btn"
        );

    if(!button){

        return;

    }

    // Menggunakan properti .onclick untuk memastikan ikatan event yang bersih dan langsung
    button.onclick = handleLogout;

}

async function handleLogout(event){

    event.preventDefault();

    const confirmLogout =
        confirm(
            "Keluar dari akun?"
        );

    if(!confirmLogout){

        return;

    }

    try{

        // Memanggil fungsi logoutUser dari auth-service.js yang sudah diberi try-catch
        await logoutUser();

        // Redirect langsung jika proses berhasil
        window.location.href = "/index.html";

    }
    catch(error){

        // Log error untuk keperluan debugging pengembang
        console.error("Gagal melakukan penanganan logout:", error);

        // Fallback aman: Tetap arahkan user ke beranda demi membersihkan state UI
        window.location.href = "/index.html";

    }

}

// Daftarkan ke global window agar dapat dieksekusi oleh auth-ui.js segera setelah HTML dropdown dimuat
window.initLogout = initLogout;