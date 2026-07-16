// =============================
// INIT HOMEPAGE
// =============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // =============================
        // LOAD HEADER & FOOTER
        // =============================

        if (typeof loadLayout === "function") {
            await loadLayout();
        }

        // =============================
        // RENDER STATIC HOMEPAGE SECTIONS
        // =============================

        if (typeof renderKategori === "function") {
            renderKategori();
        }

        if (typeof renderStatistik === "function") {
            renderStatistik();
        }

        if (typeof renderIstilah === "function") {
            renderIstilah();
        }

        if (typeof renderArtikel === "function") {
            renderArtikel();
        }

        if (typeof renderSastrawan === "function") {
            renderSastrawan();
        }

        if (typeof renderKarya === "function") {
            renderKarya();
        }

        if (typeof renderTools === "function") {
            renderTools();
        }

        if (typeof renderCTA === "function") {
            renderCTA();
        }

        // =============================
        // HERO SEARCH
        // (Hero sekarang berada langsung di index.html)
        // =============================

        if (typeof initHeroSearch === "function") {
            initHeroSearch();
        }

        // =============================
        // LOAD DATA
        // =============================

        try {

            await Promise.all([

                typeof loadLatestIstilah === "function"
                    ? loadLatestIstilah()
                    : Promise.resolve(),

                typeof loadLatestArtikel === "function"
                    ? loadLatestArtikel()
                    : Promise.resolve(),

                typeof loadPopularSastrawan === "function"
                    ? loadPopularSastrawan()
                    : Promise.resolve(),

                typeof loadLatestKarya === "function"
                    ? loadLatestKarya()
                    : Promise.resolve(),

                typeof loadWebsiteStats === "function"
                    ? loadWebsiteStats()
                    : Promise.resolve()

            ]);

        } catch (error) {

            console.error(
                "Gagal memuat data homepage:",
                error
            );

        }

    }
);