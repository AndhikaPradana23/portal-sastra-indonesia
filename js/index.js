// =============================
// INIT
// =============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memuat layout utama terlebih dahulu
        await loadLayout();

        initHeroSearch();

        await Promise.all([
            loadLatestIstilah(),
            loadLatestArtikel(),
            loadPopularSastrawan(),
            loadLatestKarya(),
            loadWebsiteStats()
        ]);

        loadTentangPortal();
    }
);

function loadTentangPortal(){
    document
        .getElementById(
            "about-portal"
        )
        .innerHTML =
            renderTentangPortal();
}