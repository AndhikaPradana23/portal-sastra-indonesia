document.addEventListener(
    "DOMContentLoaded",
    loadDetailArtikel
);

function getSlug() {

    const params =
        new URLSearchParams(
            location.search
        );

    return params.get(
        "slug"
    );

}

async function loadDetailArtikel() {

    const slug =
        getSlug();

    if (!slug) {

        document.body.innerHTML =
            "<h1>Slug tidak ditemukan.</h1>";

        return;
    }

    const { data, error } =
        await supabaseClient
            .from("artikel")
            .select("*")
            .eq(
                "slug",
                slug
            )
            .single();

    if (error || !data) {

        document.body.innerHTML =
            "<h1>Artikel tidak ditemukan.</h1>";

        return;
    }

    document.title =
        data.judul +
        " | Portal Sastra Indonesia";

    document.getElementById(
        "judul"
    ).textContent =
        data.judul;

    document.getElementById(
        "tanggal"
    ).textContent =
        "Diterbitkan pada: " +
        new Date(
            data.created_at
        ).toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    document.getElementById(
        "isi"
    ).innerHTML =
        formatIsiArtikel(
            data.isi
        );

    // Memuat istilah kamus yang terelasi dengan artikel ini
    await loadIstilahTerkait(
        data.id
    );

    // Memuat data relasi tambahan (Sastrawan, Karya, dan Artikel Lainnya)
    await loadSastrawanTerkait(
        data.id
    );

    await loadKaryaTerkait(
        data.id
    );

    await loadArtikelLain(
        data.id
    );

}

async function loadIstilahTerkait(
    artikelId
) {

    const container =
        document.getElementById(
            "istilah-terkait-container"
        );

    const {
        data: relasi,
        error: relasiError
    } =
        await supabaseClient
            .from("artikel_istilah")
            .select(
                "istilah_id"
            )
            .eq(
                "artikel_id",
                artikelId
            );

    if (relasiError) {

        console.error(
            relasiError
        );

        return;
    }

    if (
        !relasi ||
        relasi.length === 0
    ) {

        return;
    }

    const istilahIds =
        relasi.map(
            item =>
                item.istilah_id
        );

    const {
        data: istilahData,
        error: istilahError
    } =
        await supabaseClient
            .from("istilah")
            .select(`
                id,
                nama,
                slug
            `)
            .in(
                "id",
                istilahIds
            );

    if (istilahError) {

        console.error(
            istilahError
        );

        return;
    }

    container.innerHTML = `

        <section class="istilah-terkait">

            <h2>
                Istilah yang Dibahas
            </h2>

            <div class="istilah-grid">

                ${istilahData.map(item => `

                    <a
                        href="../kamus/detail.html?slug=${item.slug}"
                        class="istilah-card"
                    >

                        ${item.nama}

                    </a>

                `).join("")}

            </div>

        </section>

    `;

}

// ==========================================
// LOAD SASTRAWAN TERKAIT
// ==========================================
async function loadSastrawanTerkait(
    artikelId
){

    const container =
    document.getElementById(
        "sastrawan-terkait-container"
    );

    const {
        data
    } =
    await supabaseClient

    .from("artikel_sastrawan")

    .select(`
        sastrawan(
            nama,
            slug
        )
    `)

    .eq(
        "artikel_id",
        artikelId
    );

    if(
        !data ||
        data.length===0
    ){
        return;
    }

    container.innerHTML=`

<section>

<h2>

Sastrawan yang Dibahas

</h2>

<ul>

${data.map(item=>`

<li>

<a href="../sastrawan/detail.html?slug=${item.sastrawan.slug}">

${item.sastrawan.nama}

</a>

</li>

`).join("")}

</ul>

</section>

`;

}

// ==========================================
// LOAD KARYA TERKAIT
// ==========================================
async function loadKaryaTerkait(
    artikelId
){

    const container =
    document.getElementById(
        "karya-terkait-container"
    );

    const {
        data
    } =
    await supabaseClient

    .from("artikel_karya")

    .select(`
        karya(
            judul,
            slug
        )
    `)

    .eq(
        "artikel_id",
        artikelId
    );

    if(
        !data ||
        data.length===0
    ){
        return;
    }

    container.innerHTML=`

<section>

<h2>

Karya Sastra yang Dibahas

</h2>

<ul>

${data.map(item=>`

<li>

<a href="../karya-sastra/detail.html?slug=${item.karya.slug}">

${item.karya.judul}

</a>

</li>

`).join("")}

</ul>

</section>

`;

}

// ==========================================
// LOAD ARTIKEL LAIN (5 TERBARU SELAIN SEKARANG)
// ==========================================
async function loadArtikelLain(
    artikelId
){

    const container =
    document.getElementById(
        "artikel-terkait-container"
    );

    const {
        data
    } =
    await supabaseClient

    .from("artikel")

    .select(`
        judul,
        slug,
        id
    `)

    .neq(
        "id",
        artikelId
    )

    .order(
        "created_at",
        {
            ascending:false
        }
    )

    .limit(5);

    if(
        !data ||
        data.length===0
    ){
        return;
    }

    container.innerHTML=`

<section>

<h2>

Baca Selanjutnya

</h2>

<ul>

${data.map(item=>`

<li>

<a href="detail.html?slug=${item.slug}">

${item.judul}

</a>

</li>

`).join("")}

</ul>

</section>

`;

}

function formatIsiArtikel(
    text
) {

    if (!text)
        return "";

    return text
        .split("\n")
        .filter(
            p =>
                p.trim() !== ""
        )
        .map(
            p =>
                `<p>${p}</p>`
        )
        .join("");

}