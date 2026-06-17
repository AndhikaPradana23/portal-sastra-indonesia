// ==========================================
// 1. AMBIL PARAMETER URL & EVENT LISTENER
// ==========================================
const params = new URLSearchParams(location.search);
const slug = params.get("slug");

// Jalankan fungsi loadDetail saat DOM HTML selesai dimuat sepenuhnya
document.addEventListener("DOMContentLoaded", loadDetail);

// ==========================================
// 2. FUNGSI UTAMA LOAD DETAIL KARYA
// ==========================================
async function loadDetail() {
    const container = document.getElementById("detail-karya");

    // Validasi keberadaan elemen container di HTML
    if (!container) {
        console.error("Elemen #detail-karya tidak ditemukan");
        return;
    }

    // Validasi jika parameter slug kosong di URL
    if (!slug) {
        container.innerHTML = `
            <div class="error">
                Slug karya tidak ditemukan
            </div>
        `;
        return;
    }

    // Ambil data detail karya dari tabel Supabase berdasarkan slug
    const { data, error } = await supabaseClient
        .from("karya")
        .select("*")
        .eq("slug", slug)
        .single();

    // Penanganan jika terjadi error database atau data kosong
    if (error || !data) {
        console.error(error);
        container.innerHTML = `
            <div class="error">
                Karya tidak ditemukan
            </div>
        `;
        return;
    }

    // Set judul halaman browser secara dinamis mengikuti judul karya
    document.title = data.judul + " | Portal Sastra Indonesia";

    // Tambahkan pengaturan elemen breadcrumb dan meta deskripsi SEO
    document.getElementById("breadcrumb-title").textContent = data.judul;
    document.getElementById("meta-description").content = data.deskripsi || data.judul;

    // Ambil relasi (Sastrawan, Istilah, Artikel Terkait, dan Karya Lain)
    const sastrawanData = await loadSastrawan(data.id);
    const istilahData = await loadIstilah(data.id);
    const artikelData = await loadArtikel(data.id, sastrawanData);
    const karyaLain = await loadKaryaLain(sastrawanData, data.id);

    // Render struktur markup HTML komponen detail karya ke dalam DOM
    container.innerHTML = `
    <article class="detail-karya">
    <h1>
    ${data.judul}
    </h1>

    <p>
    <strong>Jenis :</strong>
    ${data.jenis || "-"}
    </p>

    <p>
    <strong>Tahun :</strong>
    ${data.tahun || "-"}
    </p>

    <section>
    <h2>
    Deskripsi
    </h2>
    <div>
    ${(data.deskripsi || "")
    .replace(/\n/g, "<br>")}
    </div>
    </section>

    <section>
    <h2>
    Ditulis oleh
    </h2>
    ${renderSastrawan(sastrawanData)}
    </section>

    <section>
    <h2>
    Istilah Sastra
    </h2>
    ${renderIstilah(istilahData)}
    </section>

    <section>
    <h2>
    Artikel Terkait
    </h2>
    ${renderArtikel(artikelData)}
    </section>

    <section>
    <h2>
    Karya Lain
    </h2>
    ${renderKaryaLain(karyaLain)}
    </section>
    </article>
    `;
}

// ==========================================
// 3. FUNGSI UNTUK AMBIL RELASI DATA
// ==========================================
async function loadSastrawan(karyaId) {
    const { data } = await supabaseClient
        .from("sastrawan_karya")
        .select(`
            sastrawan(
                id,
                nama,
                slug
            )
        `)
        .eq("karya_id", karyaId);

    return data || [];
}

// ==========================================
// LOAD ARTIKEL TERKAIT
// Prioritas:
// 1. artikel_karya
// 2. artikel_sastrawan
// ==========================================
async function loadArtikel(karyaId, sastrawanData) {

    //------------------------------------------------
    // PRIORITAS 1
    //------------------------------------------------

    const { data: artikelKarya } = await supabaseClient
        .from("artikel_karya")
        .select(`
            artikel(
                id,
                judul,
                slug
            )
        `)
        .eq("karya_id", karyaId);

    if (
        artikelKarya &&
        artikelKarya.length
    ) {
        return artikelKarya;
    }

    //------------------------------------------------
    // PRIORITAS 2
    //------------------------------------------------

    const hasil = [];
    const ids = new Set();

    for (const item of sastrawanData) {

        if (!item.sastrawan) continue;

        const { data } = await supabaseClient
            .from("artikel_sastrawan")
            .select(`
                artikel(
                    id,
                    judul,
                    slug
                )
            `)
            .eq("sastrawan_id", item.sastrawan.id);

        if (!data) continue;

        data.forEach(rel => {

            if (
                rel.artikel &&
                !ids.has(rel.artikel.id)
            ) {
                ids.add(rel.artikel.id);
                hasil.push(rel);
            }

        });

    }

    return hasil;
}

// ==========================================
// LOAD KARYA LAIN DARI SEMUA PENULIS
// ==========================================
async function loadKaryaLain(sastrawanData, karyaId) {

    const hasil = [];
    const ids = new Set();

    for (const item of sastrawanData) {

        if (!item.sastrawan) continue;

        const { data } = await supabaseClient
            .from("sastrawan_karya")
            .select(`
                karya(
                    id,
                    judul,
                    slug
                )
            `)
            .eq("sastrawan_id", item.sastrawan.id);

        if (!data) continue;

        data.forEach(rel => {

            if (
                rel.karya &&
                rel.karya.id != karyaId &&
                !ids.has(rel.karya.id)
            ) {
                ids.add(rel.karya.id);
                hasil.push(rel);
            }

        });

    }

    return hasil;
}

// ==========================================
// LOAD ISTILAH TERKAIT KARYA
// ==========================================
async function loadIstilah(karyaId) {

    const { data, error } =
    await supabaseClient
    .from("istilah_karya")
    .select(`
        istilah(
            id,
            nama,
            slug
        )
    `)
    .eq(
        "karya_id",
        karyaId
    );

    if(error){
        console.error(error);
        return [];
    }

    return data || [];
}

// ==========================================
// 4. HELPER FUNCTIONS FOR RENDERING HTML
// ==========================================
function renderSastrawan(data) {
    if (!data.length) {
        return "<p>-</p>";
    }

    let html = "<ul>";
    data.forEach(item => {
        if (!item.sastrawan) return;
        html += `
        <li>
        <a href="../sastrawan/detail.html?slug=${item.sastrawan.slug}">
        ${item.sastrawan.nama}
        </a>
        </li>
        `;
    });
    html += "</ul>";
    return html;
}

function renderIstilah(data){

    if(!data.length){

        return `
        <p>
            Belum ada istilah terkait.
        </p>
        `;

    }

    let html = "<ul>";

    data.forEach(item=>{

        if(!item.istilah) return;

        html += `
        <li>

        <a href="../kamus/detail.html?slug=${item.istilah.slug}">

        ${item.istilah.nama}

        </a>

        </li>
        `;

    });

    html += "</ul>";

    return html;

}

function renderArtikel(data) {
    if (!data.length) {
        return "<p>-</p>";
    }

    let html = "<ul>";
    data.forEach(item => {
        if (!item.artikel) return;
        html += `
        <li>
        <a href="../artikel/detail.html?slug=${item.artikel.slug}">
        ${item.artikel.judul}
        </a>
        </li>
        `;
    });
    html += "</ul>";
    return html;
}

function renderKaryaLain(data) {
    if (!data.length) {
        return "<p>-</p>";
    }

    let html = "<ul>";
    data.forEach(item => {
        if (!item.karya) return;
        html += `
        <li>
        <a href="detail.html?slug=${item.karya.slug}">
        ${item.karya.judul}
        </a>
        </li>
        `;
    });
    html += "</ul>";
    return html;
}