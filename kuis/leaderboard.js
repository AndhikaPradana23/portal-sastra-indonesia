document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // ==========================================
        // LOAD LAYOUT
        // ==========================================

        await loadLayout();

        // ==========================================
        // BREADCRUMB
        // ==========================================

        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Kuis Sastra",
                href: "/kuis/",
                icon: "/assets/icons/gamepad-2.svg"
            },
            {
                label: "Leaderboard"
            }
        ]);

        // ==========================================
        // RENDER AWAL
        // ==========================================

        await renderLeaderboard();

        // ==========================================
        // REFRESH SAAT KEMBALI KE TAB
        // ==========================================

        document.addEventListener(
            "visibilitychange",
            async () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    await renderLeaderboard();

                }

            }
        );

    }
);