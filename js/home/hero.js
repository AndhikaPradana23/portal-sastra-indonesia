// =============================
// HERO
// =============================

function renderHero() {
    document
        .getElementById(
            "hero-section"
        )
        .innerHTML = `
            <div class="hero">

                <div class="container">

                    <div class="hero-content">

                        <span class="badge">

                            📚 Portal Pembelajaran Sastra Indonesia

                        </span>

                        <h1>

                            Jelajahi Dunia
                            Sastra Indonesia
                            dalam Satu Portal

                        </h1>

                        <p>

                            Kamus istilah,
                            sastrawan,
                            karya,
                            artikel,
                            analisis puisi,
                            dan kuis sastra.

                        </p>

                        <div class="hero-actions">

                            <a
                                href="/kamus-istilah/"
                                class="
                                btn
                                btn-primary
                                "
                            >
                                Mulai Belajar
                            </a>

                            <a
                                href="/search/"
                                class="
                                btn
                                btn-outline
                                "
                            >
                                Cari Sekarang
                            </a>

                        </div>

                    </div>

                </div>

            </div>
        `;
}

window.renderHero = renderHero;

function initHeroSearch(){

    initGlobalSearch({

        input:"#hero-search",

        autocomplete:"#hero-autocomplete",

        autofocus:true

    });

}