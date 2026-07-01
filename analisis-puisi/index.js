document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

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