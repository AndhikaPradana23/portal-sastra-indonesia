document.addEventListener(
    "DOMContentLoaded",
    initProfilePage
);

/**
 * Controller Utama Halaman Profil
 * Mengatur alur pemuatan komponen, proteksi rute, dan rendering data.
 */
async function initProfilePage(){

    // 1. Memuat layout utama (Header & Footer)
    await loadLayout();

    // 2. Merender navigasi Breadcrumb
    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/index.html"
            },
            {
                label: "Profil Saya"
            }
        ]);
    }

    // 3. Memeriksa apakah pengguna sudah login via protected-route.js
    const allowed =
        await requireAuth();

    if(!allowed){
        // Menghentikan eksekusi jika tidak lolos (otomatis di-redirect ke /auth/login.html)
        return;
    }

    // 4. Jika lolos proteksi, muat data profil pengguna
    await loadProfile();

}

/**
 * Memuat dan menampilkan data profil pengguna ke dalam interface (DOM)
 */
async function loadProfile(){

    const container =
        document.getElementById(
            "profile-container"
        );

    if (!container) {
        console.error("Elemen #profile-container tidak ditemukan di HTML.");
        return;
    }

    // Mengambil data profil (memanggil fungsi dari service)
    const profile =
        await getProfile();

    if(!profile){

        container.innerHTML = `
            <p class="error-message">
                Profil tidak ditemukan atau gagal memuat data.
            </p>
        `;

        return;

    }

    // Proteksi XSS defensif menggunakan fallback aman untuk fungsi global
    const safeNama = 
        typeof window.escapeHtml === "function" 
            ? window.escapeHtml(profile.nama) 
            : profile.nama;

    const safeEmail = 
        typeof window.escapeHtml === "function" 
            ? window.escapeHtml(profile.email) 
            : profile.email;

    const formattedDate = 
        typeof window.formatTanggal === "function"
            ? window.formatTanggal(profile.createdAt)
            : profile.createdAt;

    // Menyuntikkan template UI Profil ke dalam kontainer HTML
    container.innerHTML = `
        <div class="profile-card">

            <div class="profile-avatar">
                👤
            </div>

            <h2>
                ${safeNama}
            </h2>

            <p class="profile-email">
                ${safeEmail}
            </p>

            <div class="profile-meta">

                <div>
                    <span>ID Pengguna</span>
                    <strong>${profile.id}</strong>
                </div>

                <div>
                    <span>Bergabung</span>
                    <strong>${formattedDate}</strong>
                </div>

            </div>

        </div>
    `;

}