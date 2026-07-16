function renderKategori() {

    document
        .getElementById(
            "kategori-section"
        )
        .innerHTML = `
            <div class="container">

                <div class="section-header">

                    <h2 class="section-title">
                        Kategori Utama
                    </h2>

                </div>

                <div class="kategori-grid">

                    <a
                        href="/kamus-istilah/"
                        class="card kategori-card"
                        aria-label="Kamus Istilah"
                    >

                        <img
                            src="/assets/icons/book-open.svg"
                            alt=""
                            class="kategori-icon"
                        >

                        <span>
                            Kamus Istilah
                        </span>

                    </a>

                    <a
                        href="/artikel/"
                        class="card kategori-card"
                        aria-label="Artikel"
                    >

                        <img
                            src="/assets/icons/newspaper.svg"
                            alt=""
                            class="kategori-icon"
                        >

                        <span>
                            Artikel
                        </span>

                    </a>

                    <a
                        href="/sastrawan/"
                        class="card kategori-card"
                        aria-label="Sastrawan"
                    >

                        <img
                            src="/assets/icons/user-round.svg"
                            alt=""
                            class="kategori-icon"
                        >

                        <span>
                            Sastrawan
                        </span>

                    </a>

                    <a
                        href="/karya-sastra/"
                        class="card kategori-card"
                        aria-label="Karya Sastra"
                    >

                        <img
                            src="/assets/icons/library-big.svg"
                            alt=""
                            class="kategori-icon"
                        >

                        <span>
                            Karya Sastra
                        </span>

                    </a>

                </div>

            </div>
        `;
}

window.renderKategori = renderKategori;