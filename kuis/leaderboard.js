document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        // Panggil fungsi global renderBreadcrumb untuk halaman papan peringkat
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
                label: "Papan Peringkat"
            }
        ]);

        renderLeaderboard();

    }
);