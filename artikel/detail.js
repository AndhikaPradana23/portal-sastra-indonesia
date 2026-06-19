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

// ======================================================
// FUNGSI UTAMA LOAD DETAIL ARTIKEL
// ======================================================
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

    // ==========================================
    // COUNTER VIEWS OTOMATIS (DENGAN LOGGING)
    // ==========================================
    await tambahViews(data.id, data.views);

    // Set Judul Halaman Browser
    document.title =
        data.judul +
        " | Portal Sastra Indonesia";

    // Isi konten judul utama teks
    document.getElementById(
        "judul"
    ).textContent =
        data.judul;

    renderBreadcrumb(data);

    // ==========================================
    // LANGKAH 3: PENGISIAN AREA METADATA ARTIKEL
    // ==========================================
    document.getElementById(
        "kategori"
    ).innerHTML = `
        <strong>Kategori :</strong> ${data.kategori || "-"}
    `;

    document.getElementById(
        "tanggal"
    ).innerHTML = `
        <strong>Publish :</strong> ${new Date(
            data.published_at || data.created_at
        ).toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )}
    `;

    document.getElementById(
        "estimasi-baca"
    ).innerHTML = `
        <strong>Estimasi :</strong> ${hitungEstimasiBaca(data.isi)}
    `;

    // ==========================================
    // LANGKAH 4: RENDERING GAMBAR MINI (THUMBNAIL)
    // ==========================================
    if (data.thumbnail) {
        document.getElementById(
            "thumbnail-container"
        ).innerHTML = `
            <img
                src="${data.thumbnail}"
                alt="${data.judul}"
                style="
                    width: 100%;
                    max-height: 450px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 25px;
                "
            >
        `;
    }

    // ==========================================
    // LANGKAH 5: RENDERING LABEL TAGS
    // ==========================================
    const tagContainer = document.getElementById("tag-container");
    if (Array.isArray(data.tag) && data.tag.length) {
        tagContainer.innerHTML = `
            <div class="tag-list">
                ${data.tag.map(tag => `
                    <span class="tag">${tag}</span>
                `).join("")}
            </div>
        `;
    }

    // Tampilkan isi teks tubuh artikel
    document.getElementById(
        "isi"
    ).innerHTML =
        formatIsiArtikel(
            data.isi
        );

    // ==========================================
    // PENULIS & JSON-LD META (Langkah 2)
    // ==========================================
    const authorName = await loadPenulisArtikel(data.id);

    updateArticleSchema(data, authorName);

    // Memuat istilah kamus yang terelasi dengan artikel ini
    await loadIstilahTerkait(
        data.id
    );

    // Memuat data relasi tambahan (Sastrawan, Karya, dan Artikel Terkait)
    await loadSastrawanTerkait(
        data.id
    );

    await loadKaryaTerkait(
        data.id
    );

    // ==========================================
    // LANGKAH 1: PERUBAHAN PEMANGGILAN BARU
    // ==========================================
    await loadArtikelTerkait(
        data
    );

}

// ==========================================
// BREADCRUMB
// ==========================================
function renderBreadcrumb(
    artikel
){

    const container =
    document.getElementById(
        "breadcrumb"
    );

    container.innerHTML =
    `
<a href="../index.html">
Beranda
</a>
<span>
›
</span>
<a href="index.html">
Artikel
</a>
<span>
›
</span>
<a href="index.html?kategori=${encodeURIComponent(
artikel.kategori || ""
)}">
${artikel.kategori || "Artikel"}
</a>
<span>
›
</span>
<span class="current">
${artikel.judul}
</span>
`;

}

// ==========================================
// FUNGSI RELASI PENULIS (SASTRAWAN) (Langkah 1)
// ==========================================
async function loadPenulisArtikel(
    artikelId
){

    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel_sastrawan")
    .select(`
        sastrawan(
            nama
        )
    `)
    .eq(
        "artikel_id",
        artikelId
    );

    let namaPenulis =
    "Portal Sastra Indonesia";

    if(
        !error &&
        data &&
        data.length
    ){

        namaPenulis =
        data
        .map(item=>item.sastrawan.nama)
        .join(", ");

    }

    document
    .getElementById(
        "penulis"
    )
    .innerHTML=
    `
<strong>Penulis :</strong>

${namaPenulis}
`;

    return namaPenulis;

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
        console.error(relasiError);
        return;
    }

    if (!relasi || relasi.length === 0) {
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
        console.error(istilahError);
        return;
    }

    container.innerHTML = `
        <section class="istilah-terkait">
            <h2>Istilah yang Dibahas</h2>
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
// LOAD DETAIL RELASI SASTRAWAN TERKAIT 
// ==========================================
async function loadSastrawanTerkait(
    artikelId
){

    const container =
    document.getElementById(
        "sastrawan-terkait-container"
    );

    const { data } = await supabaseClient
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

    if(!data || data.length === 0){
        return;
    }

    container.innerHTML = `
        <section>
            <h2>Sastrawan yang Dibahas</h2>
            <ul>
                ${data.map(item => item.sastrawan ? `
                    <li>
                        <a href="../sastrawan/detail.html?slug=${item.sastrawan.slug}">
                            ${item.sastrawan.nama}
                        </a>
                    </li>
                ` : "").join("")}
            </ul>
        </section>
    `;

}

// ==========================================
// LOAD DETAIL RELASI KARYA TERKAIT
// ==========================================
async function loadKaryaTerkait(
    artikelId
){

    const container =
    document.getElementById(
        "karya-terkait-container"
    );

    const { data } = await supabaseClient
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

    if(!data || data.length === 0){
        return;
    }

    container.innerHTML = `
        <section>
            <h2>Karya Sastra yang Dibahas</h2>
            <ul>
                ${data.map(item => item.karya ? `
                    <li>
                        <a href="../karya-sastra/detail.html?slug=${item.karya.slug}">
                            ${item.karya.judul}
                        </a>
                    </li>
                ` : "").join("")}
            </ul>
        </section>
    `;

}

// ==========================================
// LANGKAH 2: ARTIKEL TERKAIT OTOMATIS (SKORING)
// Prioritas:
// 1. Kategori
// 2. Tag
// 3. Publish terbaru
// ==========================================
async function loadArtikelTerkait(
    artikel
){

    const container =
    document.getElementById(
        "artikel-terkait-container"
    );

    //--------------------------------------------------
    // Ambil kandidat artikel
    //--------------------------------------------------
    const {
        data,
        error
    } =
    await supabaseClient
    .from("artikel")
    .select(`
        id,
        judul,
        slug,
        kategori,
        tag,
        published_at
    `)
    .neq(
        "id",
        artikel.id
    )
    .order(
        "published_at",
        {
            ascending:false
        }
    );

    if(
        error ||
        !data
    ){
        console.error(error);
        return;
    }

    //--------------------------------------------------
    // Hitung skor relevansi
    //--------------------------------------------------
    const hasil =
    data.map(item=>{

        let skor = 0;

        //---------------------------------
        // kategori sama
        //---------------------------------
        if(
            artikel.kategori &&
            item.kategori===artikel.kategori
        ){
            skor += 100;
        }

        //---------------------------------
        // tag sama
        //---------------------------------
        if(
            Array.isArray(
                artikel.tag
            ) &&
            Array.isArray(
                item.tag
            )
        ){
            artikel.tag.forEach(tag=>{
                if(
                    item.tag.includes(tag)
                ){
                    skor += 10;
                }
            });
        }

        return {
            ...item,
            skor
        };

    });

    //--------------------------------------------------
    // Urutkan berdasarkan skor
    //--------------------------------------------------
    hasil.sort(
        (a,b)=>{
            if(
                b.skor===a.skor
            ){
                return new Date(
                    b.published_at
                )-
                new Date(
                    a.published_at
                );
            }
            return b.skor-a.skor;
        }
    );

    //--------------------------------------------------
    // Ambil 5 artikel terbaik
    //--------------------------------------------------
    const artikelTerkait =
    hasil
    .slice(0,5);

    if(
        artikelTerkait.length===0
    ){
        return;
    }

    //--------------------------------------------------
    // Render
    //--------------------------------------------------
    container.innerHTML =
    `
    <section class="artikel-terkait-section">
        <h2>Artikel Terkait</h2>
        <ul>
            ${artikelTerkait.map(item=>`
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

// ==========================================
// FORMATTING TEXT PARAGRAPH SCRIPT
// ==========================================
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

// ==========================================
// HELPER ESTIMASI WAKTU BACA
// ==========================================
function hitungEstimasiBaca(text) {

    if (!text)
        return "1 menit";

    const jumlahKata =
    text
        .trim()
        .split(/\s+/)
        .length;

    const menit =
    Math.max(
        1,
        Math.ceil(
            jumlahKata / 200
        )
    );

    return `${menit} menit baca`;

}

// ==========================================
// JSON-LD SCHEMA GENERATOR (SEO) (Langkah 3, 4, 5, & 6)
// ==========================================
function updateArticleSchema(
    artikel,
    authorName
){

    // Langkah 4: Hitung jumlah kata
    const wordCount =
    artikel.isi
    ? artikel.isi
    .trim()
    .split(/\s+/)
    .length
    : 0;

    const schema = [
        // Langkah 5 & 6: Object Article Baru
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: artikel.judul,
            description: artikel.ringkasan || artikel.judul,
            image: artikel.thumbnail,
            author: {
                "@type": "Person",
                name: authorName
            },
            publisher: {
                "@type": "Organization",
                name: "Portal Sastra Indonesia",
                logo: {
                    "@type": "ImageObject",
                    url: window.location.origin + "/images/logo.png" // Sesuai dengan konfigurasi file path logo Anda
                }
            },
            datePublished: artikel.published_at || artikel.created_at,
            dateModified: artikel.updated_at || artikel.created_at,
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": window.location.href
            },
            keywords: Array.isArray(artikel.tag) ? artikel.tag.join(", ") : artikel.tag,
            articleSection: artikel.kategori,
            wordCount: wordCount,
            genre: artikel.kategori,
            about: artikel.kategori,
            inLanguage: "id-ID",
            copyrightHolder: {
                "@type": "Organization",
                name: "Portal Sastra Indonesia"
            },
            copyrightYear: new Date(artikel.published_at || artikel.created_at).getFullYear(),
            isAccessibleForFree: true,
            url: window.location.href
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Beranda",
                    "item": window.location.origin
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Artikel",
                    "item": window.location.origin + "/artikel/"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": artikel.kategori || "Artikel",
                    "item": window.location.origin + "/artikel/?kategori=" + encodeURIComponent(artikel.kategori || "")
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": artikel.judul,
                    "item": window.location.href
                }
            ]
        }
    ];

    document
    .getElementById(
        "jsonld-schema"
    )
    .textContent =
    JSON.stringify(
        schema,
        null,
        2
    );

}

// ==========================================
// MENAMBAHKAN JUMLAH VIEW (DENGAN LOGGING)
// ==========================================
async function tambahViews(id, views){

    const { data, error } =
    await supabaseClient
        .from("artikel")
        .update({
            views: (views || 0) + 1
        })
        .eq("id", id)
        .select();

    console.log("Data hasil update views:", data);
    console.log("Error hasil update views:", error);

}