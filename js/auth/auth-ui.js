// GANTI: document.addEventListener("DOMContentLoaded", initAuthUI);
// MENJADI LEBIH AMAN:
window.initAuthUI = initAuthUI;

async function initAuthUI(){

    await updateAuthMenu();

    // Menangkap parameter event untuk memantau perubahan status autentikasi di console
    supabaseClient.auth.onAuthStateChange(
        async (event) => {

            console.log(
                "Auth event terpantau:",
                event
            );

            await updateAuthMenu();

        }
    );

}

async function updateAuthMenu(){

    const menu =
        document.getElementById(
            "auth-menu"
        );

    // Debugging untuk cek apakah elemen sudah ada di DOM
    console.log("Elemen #auth-menu:", menu);

    if(!menu){

        return;

    }

    const user =
        await getCurrentUser();

    // Debugging untuk cek status session user
    console.log("Data user:", user);

    if(!user){

        menu.innerHTML = `
            <a href="/auth/login.html">
                Masuk
            </a>
        `;

        return;

    }

    const nama =
        user.user_metadata.nama ||
        user.email;

    // Membaca escapeHtml dengan aman menggunakan fallback demi menghilangkan dependency ketat
    const safeNama = 
        typeof window.escapeHtml === "function"
            ? window.escapeHtml(nama)
            : nama;

    menu.innerHTML = `
        <div class="auth-dropdown">

            <span>

                👋 ${safeNama}

            </span>

            <a
                href="#"
                id="logout-btn"
            >

                Logout

            </a>

        </div>
    `;

    // Pastikan initLogout dipanggil jika fungsi globalnya tersedia
    if (typeof window.initLogout === "function") {
        window.initLogout();
    }

}