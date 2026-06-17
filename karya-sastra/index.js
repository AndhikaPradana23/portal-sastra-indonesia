loadKarya();

async function loadKarya(){

    const container =
    document.getElementById(
        "karya-container"
    );

    const {
        data,
        error
    } =
    await supabaseClient

        .from("karya")

        .select("*")

        .order(
            "judul"
        );

    if(error){

        container.innerHTML =
        "Gagal memuat data";

        return;
    }

    container.innerHTML =

    data.map(item => `

        <article
            class="card-karya"
        >

            <h2>

                <a
                    href="detail.html?slug=${item.slug}"
                >

                    ${item.judul}

                </a>

            </h2>

            <p>

                ${item.jenis || "-"}

            </p>

        </article>

    `).join("");
}