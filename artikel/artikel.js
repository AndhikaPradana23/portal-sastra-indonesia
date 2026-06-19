// ==========================================
// VARIABEL GLOBAL & INISIALISASI
// ==========================================
let kategoriAktif = "";
let tagAktif = "";
let keywordAktif = "";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        updateSEO();

        await loadKategori();

        await loadTag();

        await loadArtikel(
            kategoriAktif,
            tagAktif,
            keywordAktif
        );

        await loadArtikelPopuler();

        await loadArtikelTerbaru();

    }
);

// ==========================================
// EVENT LISTENER FILTER KATEGORI (CLICK)
// ==========================================
document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "kategori-btn"
            )
        ) {

            document
                .querySelectorAll(
                    ".kategori-btn"
                )
                .forEach(btn =>
                    btn.classList.remove(
                        "aktif"
                    )
                );

            event.target.classList.add(
                "aktif"
            );

            kategoriAktif =
                event.target.dataset.kategori;

            loadArtikel(
                kategoriAktif,
                tagAktif,
                keywordAktif
            );

        }

    }
);

// ==========================================
// EVENT LISTENER FILTER TAG (CLICK)
// ==========================================
document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "tag-btn"
            )
        ) {

            document
                .querySelectorAll(
                    ".tag-btn"
                )
                .forEach(btn =>
                    btn.classList.remove(
                        "aktif"
                    )
                );

            event.target.classList.add(
                "aktif"
            );

            tagAktif =
                event.target.dataset.tag;

            loadArtikel(
                kategoriAktif,
                tagAktif,
                keywordAktif
            );

        }

    }
);

// ==========================================
// EVENT LISTENER PENCARIAN REALTIME (INPUT)
// ==========================================
document.addEventListener(
    "input",
    event=>{

        if(
            event.target.id==="search-artikel"
        ){

            keywordAktif=
            event.target.value.trim();

            loadArtikel(
                kategoriAktif,
                tagAktif,
                keywordAktif
            );

        }

    }
);

// ==========================================
// LOAD FILTER KATEGORI
// ==========================================
async function loadKategori(){

    const container =
    document.getElementById(
        "kategori-filter"
    );

    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel")
    .select("kategori");

    if(error){

        console.error(error);

        container.innerHTML=
        "Gagal memuat kategori";

        return;

    }

    const kategoriUnik = [
        ...new Set(
            data
            .map(item=>item.kategori)
            .filter(Boolean)
        )
    ]
    .sort();

    container.innerHTML =
    `
    <button
        class="kategori-btn aktif"
        data-kategori=""
    >
        Semua
    </button>
    ${kategoriUnik.map(item=>`
        <button
            class="kategori-btn"
            data-kategori="${item}"
        >
            ${item}
        </button>
    `).join("")}
    `;

}

// ==========================================
// LOAD FILTER TAG
// ==========================================
async function loadTag(){

    const container =
    document.getElementById(
        "tag-filter"
    );

    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel")
    .select("tag");

    if(error){

        console.error(error);

        container.innerHTML =
        "Gagal memuat tag";

        return;

    }

    const semuaTag = [];

    data.forEach(item=>{

        if(Array.isArray(item.tag)){

            semuaTag.push(...item.tag);

        }

    });

    const tagUnik =
    [...new Set(semuaTag)]
    .sort();

    container.innerHTML =
    `
    <button
        class="tag-btn aktif"
        data-tag=""
    >
        Semua
    </button>
    ${tagUnik.map(tag=>`
        <button
            class="tag-btn"
            data-tag="${tag}"
        >
            ${tag}
        </button>
    `).join("")}
    `;

}

// ==========================================
// FUNGSI UTAMA LOAD ARTIKEL (DENGAN MULTI-FILTER & KEYWORD)
// ==========================================
async function loadArtikel(kategori = "", tag = "", keyword = "") {

    const container =
    document.getElementById(
        "artikel-list"
    );

    let query =
    supabaseClient
    .from("artikel")
    .select("*");

    if(kategori){
        query=query.eq(
            "kategori",
            kategori
        );
    }

    if(tag){
        query=query.contains(
            "tag",
            [tag]
        );
    }

    if(keyword){
        query = query.or(
            `judul.ilike.%${keyword}%,ringkasan.ilike.%${keyword}%,isi.ilike.%${keyword}%`
        );
    }

    const {
        data,
        error
    } =
    await query
    .order(
        "published_at",
        {
            ascending:false
        }
    );

    if (error) {

        console.error(error);

        container.innerHTML =
        "<p>Gagal memuat artikel.</p>";

        return;
    }

    if (!data.length) {

        container.innerHTML = `
        <p>
        Tidak ditemukan artikel yang sesuai dengan filter yang dipilih.
        </p>
        `;

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

// ==========================================
// SIDEBAR ARTIKEL POPULER
// ==========================================
async function loadArtikelPopuler(){

    const container =
    document.getElementById(
        "artikel-populer"
    );

    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel")
    .select(`
        judul,
        slug,
        views
    `)
    .order(
        "views",
        {
            ascending:false
        }
    )
    .limit(5);

    if(
        error
    ){

        console.error(error);

        container.innerHTML=
        "<p>Gagal memuat.</p>";

        return;

    }

    if(
        !data.length
    ){

        container.innerHTML=
        "<p>Belum ada artikel.</p>";

        return;

    }

    container.innerHTML=
    `
    <ul class="sidebar-list">
        ${data.map(item=>`
            <li>
                <a href="detail.html?slug=${item.slug}">
                    ${item.judul}
                </a>
                <br>
                <small>
                    ${item.views || 0} kali dibaca
                </small>
            </li>
        `).join("")}
    </ul>
    `;

}

// ==========================================
// SIDEBAR ARTIKEL TERBARU
// ==========================================
async function loadArtikelTerbaru(){

    const container =
    document.getElementById(
        "artikel-terbaru"
    );

    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel")
    .select(`
        judul,
        slug,
        published_at
    `)
    .order(
        "published_at",
        {
            ascending:false
        }
    )
    .limit(5);

    if(error){

        console.error(error);

        container.innerHTML=
        "<p>Gagal memuat.</p>";

        return;

    }

    if(!data.length){

        container.innerHTML=
        "<p>Belum ada artikel.</p>";

        return;

    }

    container.innerHTML=
    `
    <ul class="sidebar-list">
    ${data.map(item=>`
        <li>
            <a
                href="detail.html?slug=${item.slug}"
            >
                ${item.judul}
            </a>
            <br>
            <small>
                ${new Date(
                    item.published_at
                ).toLocaleDateString(
                    "id-ID",
                    {
                        day:"numeric",
                        month:"long",
                        year:"numeric"
                    }
                )}
            </small>
        </li>
    `).join("")}
    </ul>
    `;

}

// ==========================================
// SEO HALAMAN DAFTAR ARTIKEL
// ==========================================
function updateSEO(){

    const title =
    "Artikel Sastra Indonesia | Portal Sastra Indonesia";

    const description =
    "Kumpulan artikel sastra Indonesia mengenai teori sastra, kritik sastra, puisi, novel, cerpen, drama, serta berbagai kajian akademik.";

    document.title = title;

    document
    .getElementById(
        "meta-description"
    )
    .content =
    description;

    document
    .getElementById(
        "canonical-url"
    )
    .href =
    window.location.href;

    document
    .getElementById(
        "og-title"
    )
    .content =
    title;

    document
    .getElementById(
        "og-description"
    )
    .content =
    description;

    document
    .getElementById(
        "og-url"
    )
    .content =
    window.location.href;

    document
    .getElementById(
        "twitter-title"
    )
    .content =
    title;

    document
    .getElementById(
        "twitter-description"
    )
    .content =
    description;

}