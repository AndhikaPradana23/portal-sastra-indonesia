document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        // Merender navigasi Breadcrumb untuk halaman Analisis Puisi
        if (typeof renderBreadcrumb === "function") {
            renderBreadcrumb([
                {
                    label: "Beranda",
                    href: "/",
                    icon: "/assets/icons/house.svg"
                },
                {
                    label: "Analisis Puisi",
                    icon: "/assets/icons/wand.svg" // Anda bisa menyesuaikan ikon ini (misal: wand.svg, Sparkles.svg, dll)
                }
            ]);
        }

        initPuisiInput();

        document
            .getElementById(
                "analyze-btn"
            )
            .addEventListener(
                "click",
                analyzePuisi
            );

    }
);