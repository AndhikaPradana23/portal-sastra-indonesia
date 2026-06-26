// ==========================================================================
// SEARCH HISTORY PAGE RENDERER & CONTROLLER
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    initHistoryPage
);

/**
 * Inisialisasi utama halaman riwayat pencarian.
 * Memastikan pengguna sudah login terlebih dahulu sebelum merender data riwayat.
 */
async function initHistoryPage(){
    // Memastikan modul requireAuth tersedia (biasanya dari auth-service.js)
    if (typeof requireAuth === "function") {
        await requireAuth();
    }

    // Render data riwayat pencarian awal
    await renderHistory();

    // Inisialisasi event listener untuk tombol hapus semua riwayat
    initClearHistoryButton();
}

/**
 * Mengambil data dari SearchHistoryService dan merendernya ke dalam struktur DOM HTML.
 */
async function renderHistory(){
    const container =
        document.getElementById(
            "history-list"
        );

    if (!container) {
        console.warn("Elemen dengan ID 'history-list' tidak ditemukan di halaman ini.");
        return;
    }

    // Memastikan service riwayat pencarian tersedia secara global
    if (!window.SearchHistoryService) {
        container.innerHTML = "<p>Gagal memuat layanan riwayat.</p>";
        return;
    }

    const history =
        await window.SearchHistoryService.getSearchHistory();

    if(!history || !history.length){
        container.innerHTML =
            "<p>Belum ada riwayat pencarian.</p>";
        return;
    }

    container.innerHTML =
        history.map(item => `
            <article class="history-card">
                <a href="/search/index.html?q=${encodeURIComponent(item.keyword)}">
                    🔍 ${escapeHtml(item.keyword)}
                </a>
            </article>
        `).join("");
}

/**
 * Menginisialisasi event listener klik pada tombol "Hapus Semua" riwayat.
 */
function initClearHistoryButton() {
    const clearButton = document.getElementById("clear-history");
    
    if (!clearButton) {
        return;
    }

    clearButton.addEventListener(
        "click",
        async () => {
            const confirmDelete =
                confirm(
                    "Apakah Anda yakin ingin menghapus semua riwayat?"
                );

            if(!confirmDelete){
                return;
            }

            if (window.SearchHistoryService) {
                await window.SearchHistoryService.clearHistory();
                // Render ulang kontainer riwayat agar visual langsung kosong secara reaktif
                await renderHistory();
            }
        }
    );
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================

/**
 * Mengamankan string teks dari karakter HTML berbahaya (Mencegah XSS)
 * @param {string} text 
 * @returns {string}
 */
function escapeHtml(text){
    if (text == null) {
        return "";
    }
    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}