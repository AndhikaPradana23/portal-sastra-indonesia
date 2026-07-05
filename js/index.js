// =============================
// INIT & RENDERING ALL SECTIONS
// =============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // 1. Memuat layout utama (header/footer/base skeleton) terlebih dahulu jika ada
        if (typeof loadLayout === "function") {
            await loadLayout();
        }

        // 2. Render struktur UI statis awal (Hero, Search, Kategori, dll)
        if (typeof renderHero === "function") renderHero();
        if (typeof renderHeroSearch === "function") renderHeroSearch();
        if (typeof renderKategori === "function") renderKategori();
        if (typeof renderStatistik === "function") renderStatistik();
        if (typeof renderIstilah === "function") renderIstilah();
        if (typeof renderArtikel === "function") renderArtikel();
        if (typeof renderSastrawan === "function") renderSastrawan();
        if (typeof renderKarya === "function") renderKarya();
        if (typeof renderTools === "function") renderTools();
        if (typeof renderTentang === "function") renderTentang();
        if (typeof renderCTA === "function") renderCTA();

        // 3. Inisialisasi event listener dan fungsionalitas search bar
        if (typeof initHeroSearch === "function") {
            initHeroSearch();
        }

        // 4. Memuat komponen dinamis lokal yang membutuhkan render internal (Tentang Portal)
        loadTentangPortal();

        // 5. Memuat data secara asynchronous dari database (Supabase/API) secara paralel
        try {
            await Promise.all([
                typeof loadLatestIstilah === "function" ? loadLatestIstilah() : Promise.resolve(),
                typeof loadLatestArtikel === "function" ? loadLatestArtikel() : Promise.resolve(),
                typeof loadPopularSastrawan === "function" ? loadPopularSastrawan() : Promise.resolve(),
                typeof loadLatestKarya === "function" ? loadLatestKarya() : Promise.resolve(),
                typeof loadWebsiteStats === "function" ? loadWebsiteStats() : Promise.resolve()
            ]);
        } catch (error) {
            console.error("Gagal memuat data dinamis homepage:", error);
        }
    }
);

/**
 * Memuat dan menginjeksikan template komponen Tentang Portal ke dalam DOM target.
 */
function loadTentangPortal() {
    const container = document.getElementById("about-portal") || document.getElementById("tentang-section");
    if (container && typeof renderTentangPortal === "function") {
        container.innerHTML = renderTentangPortal();
    }
}