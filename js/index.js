// =============================
// INIT
// =============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

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