document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

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
                label: "Hasil Kuis"
            }
        ]);

        renderQuizResult();

    }
);