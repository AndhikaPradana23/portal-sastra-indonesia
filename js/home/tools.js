function renderTools() {

    document
        .getElementById(
            "tools-section"
        )
        .innerHTML = `
            <div class="container">

                <div class="section-header">

                    <h2>

                        Tools Sastra

                    </h2>

                </div>

                <div class="kategori-grid">

                    <a
                        href="/sitasi/"
                        class="card"
                    >
                        📑
                        Generator Sitasi
                    </a>

                    <a
                        href="/analisis-puisi/"
                        class="card"
                    >
                        ✍️
                        Analisis Puisi
                    </a>

                    <a
                        href="/kuis/"
                        class="card"
                    >
                        🧠
                        Kuis Sastra
                    </a>

                </div>

            </div>
        `;
}

window.renderTools =
    renderTools;