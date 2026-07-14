document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        // Panggil fungsi global renderBreadcrumb untuk halaman bermain kuis
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
                label: "Main Kuis"
            }
        ]);

        updateQuizSEO();

        renderQuizSchema();

        // Pembersihan jawaban lama dan inisialisasi ulang nomor soal serta waktu kuis
        clearQuizAnswers();
        localStorage.removeItem("quiz_time");
        setCurrentQuestion(0);

        initQuizEngine();

    }
);