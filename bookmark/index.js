document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // 1. Memuat layout (Header, Footer, dll) terlebih dahulu
        await loadLayout();

        // 2. Memeriksa status autentikasi user
        const allowed =
            await requireAuth();

        // 3. Jika tidak diizinkan (belum login), hentikan proses inisialisasi halaman bookmark
        if(!allowed){

            return;

        }

        // 4. Jika lolos proteksi, inisialisasi data bookmark jalan terus
        initBookmarkPage();

    }
);

/**
 * Mengamankan halaman bookmark dengan memeriksa sesi pengguna secara dinamis.
 * Jika sesi kosong, menyimpan pesan UX ke sessionStorage lalu me-redirect ke login.
 * @returns {Promise<boolean>} Mengembalikan true jika berhak mengakses, false jika tidak.
 */
async function requireAuth() {
    try {
        // Menggunakan fungsi aman yang sebelumnya kita refactor di auth-service.js
        const user = await getCurrentUser();

        if (user) {
            // User terautentikasi, izinkan masuk ke halaman
            return true;
        }

        // --- LANGKAH 7: MENYIMPAN PESAN UX SEBELUM REDIRECT ---
        sessionStorage.setItem(
            "authMessage",
            "Silakan masuk terlebih dahulu untuk melihat bookmark Anda."
        );

        // --- LANGKAH 3: REDIRECT DENGAN PARAMETER QUERY DINAMIS ---
        // Mengarahkan ke login dengan membawa alamat asal agar setelah login bisa otomatis kembali ke sini
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/auth/login.html?redirect=${encodeURIComponent(currentPath)}`;
        
        return false;
    } 
    catch (error) {
        console.error("Terjadi kesalahan pada sistem proteksi halaman:", error);
        window.location.href = "/index.html";
        return false;
    }
}

/**
 * Fungsi utama untuk memuat data dan merender halaman bookmark pengguna.
 */
function initBookmarkPage() {
    console.log("Inisialisasi halaman bookmark sukses. Memuat daftar item...");
    
    // Memanggil fungsi global renderBreadcrumb untuk halaman Bookmark
    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Bookmark Saya",
                icon: "/assets/icons/bookmark.svg" // Opsional: sesuaikan jika ada icon spesifik bookmark
            }
        ]);
    }

    // Tulis logika pemuatan data bookmark Anda di bawah ini
    // Contoh: loadUserBookmarks();
}