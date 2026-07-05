function renderCTA() {

    document
        .getElementById(
            "cta-section"
        )
        .innerHTML = `
            <div class="cta">

                <div class="container">

                    <h2>

                        Siap Menjelajahi
                        Sastra Indonesia?

                    </h2>

                    <a
                        href="/kamus-istilah/"
                        class="
                        btn
                        btn-primary
                        "
                    >
                        Mulai Sekarang
                    </a>

                </div>

            </div>
        `;
}

window.renderCTA =
    renderCTA;