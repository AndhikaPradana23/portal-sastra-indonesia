document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        updateQuizSEO();

        renderQuizSchema();

        initQuizEngine();

    }
);