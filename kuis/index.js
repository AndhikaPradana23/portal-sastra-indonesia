document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        // Panggil fungsi global renderBreadcrumb untuk halaman kuis
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Kuis Sastra",
                icon: "/assets/icons/gamepad-2.svg" // Atau ikon lain yang sesuai seperti pen, award, dll.
            }
        ]);

        initQuizPage();

    }
);