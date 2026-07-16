function renderTools() {

    document
        .getElementById(
            "tools-section"
        )
        .innerHTML = `
            <div class="container">

                <div class="section-header">

                    <div>

                        <h2 class="section-title">
                            Tools Sastra
                        </h2>

                        <p class="section-description">
                            Berbagai alat bantu yang memudahkan pembelajaran dan penelitian sastra Indonesia.
                        </p>

                    </div>

                </div>

                <div class="kategori-grid">

                    <a
                        href="/sitasi/"
                        class="card tool-card"
                        aria-label="Generator Sitasi"
                    >

                        <img
                            src="/assets/icons/file-text.svg"
                            alt=""
                            class="tool-icon"
                        >

                        <span>
                            Generator Sitasi
                        </span>

                    </a>

                    <a
                        href="/analisis-puisi/"
                        class="card tool-card"
                        aria-label="Analisis Puisi"
                    >

                        <img
                            src="/assets/icons/feather.svg"
                            alt=""
                            class="tool-icon"
                        >

                        <span>
                            Analisis Puisi
                        </span>

                    </a>

                    <a
                        href="/kuis/"
                        class="card tool-card"
                        aria-label="Kuis Sastra"
                    >

                        <img
                            src="/assets/icons/brain.svg"
                            alt=""
                            class="tool-icon"
                        >

                        <span>
                            Kuis Sastra
                        </span>

                    </a>

                </div>

            </div>
        `;
}

window.renderTools = renderTools;