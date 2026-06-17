document.addEventListener(
    "DOMContentLoaded",
    loadArtikel
);

async function loadArtikel() {

    const container =
    document.getElementById(
        "artikel-list"
    );

    const { data, error } =
    await supabaseClient
        .from("artikel")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(error);

        container.innerHTML =
        "<p>Gagal memuat artikel.</p>";

        return;
    }

    if (!data.length) {

        container.innerHTML =
        "<p>Belum ada artikel.</p>";

        return;
    }

    container.innerHTML =
    data.map(item => `

        <article class="post-card">

            <h2>
                ${item.judul}
            </h2>

            <p>
                ${item.ringkasan || ""}
            </p>

            <a
                class="read-more"
                href="detail.html?slug=${item.slug}"
            >
                Baca Selengkapnya →
            </a>

        </article>

    `).join("");

}