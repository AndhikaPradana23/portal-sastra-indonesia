function renderKategori() {

    document
        .getElementById(
            "kategori-section"
        )
        .innerHTML = `
            <div class="container">

                <div class="section-header">

                    <h2>
                        Kategori Utama
                    </h2>

                </div>

                <div class="kategori-grid">

                    <a
                        href="/kamus-istilah/"
                        class="card"
                    >
                        📖
                        Kamus Istilah
                    </a>

                    <a
                        href="/artikel/"
                        class="card"
                    >
                        📝
                        Artikel
                    </a>

                    <a
                        href="/sastrawan/"
                        class="card"
                    >
                        👤
                        Sastrawan
                    </a>

                    <a
                        href="/karya-sastra/"
                        class="card"
                    >
                        📚
                        Karya
                    </a>

                </div>

            </div>
        `;
}

window.renderKategori =
    renderKategori;