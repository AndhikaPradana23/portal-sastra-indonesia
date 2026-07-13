document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        const allowed =
            await requireAuth();

        if(!allowed){

            return;

        }

        initBookmarkPage();

    }
);

/**
 * Mengamankan halaman bookmark dengan memeriksa sesi pengguna secara dinamis.
 * Jika sesi kosong, menyimpan pesan UX ke sessionStorage lalu me-redirect ke login.
 * @returns {Promise<boolean>}
 */
async function requireAuth() {
    try {
        const user = await getCurrentUser();

        if (user) {
            return true;
        }

        sessionStorage.setItem(
            "authMessage",
            "Silakan masuk terlebih dahulu untuk melihat bookmark Anda."
        );

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
    
    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Bookmark Saya",
                icon: "/assets/icons/bookmark.svg"
            }
        ]);
    }

    // Tulis logika pemuatan data bookmark Anda di bawah ini
    // Contoh: loadUserBookmarks();
}