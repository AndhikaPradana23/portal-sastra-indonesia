// ==========================================
// 1. AMBIL PARAMETER URL & INISIALISASI
// ==========================================
const params = new URLSearchParams(location.search);
const slug = params.get("slug");

// Jalankan fungsi pemuatan data utama
loadDetail();

// ==========================================
// 2. FUNGSI UTAMA LOAD DETAIL SASTRAWAN
// ==========================================
async function loadDetail() {
    const container = document.getElementById("detail-container");
    
    if (!container) return;

    // Ambil data profil sastrawan berdasarkan slug URL
    const { data, error } = await supabaseClient
        .from("sastrawan")
        .select("*")
        .eq("slug", slug)
        .single();

    // Penanganan jika terjadi error atau data tidak ditemukan
    if (error || !data) {
        container.innerHTML = `
        <div class="error">
            Data tidak ditemukan
        </div>
        `;
        return;
    }

    // Set judul halaman browser dan data meta tags secara dinamis via helper SEO
    updateSEO(data);

    // Ambil data relasi dan detail karya sastra yang ditulis tokoh terkait
    const karyaData = await loadKaryaSastrawan(data.id);

    // Ambil data penghargaan sastrawan terkait
    const penghargaanData = await loadPenghargaanSastrawan(data.id);

    // Ambil data rekomendasi sastrawan terkait secara otomatis
    const sastrawanTerkait = await loadSastrawanTerkait(data);

    // Ambil referensi akademik
    const referensiData = await loadReferensiSastrawan(data.id);

    // Ambil artikel terkait
    const artikelData = await loadArtikelSastrawan(data.id);

    // Ambil istilah sastrawan terkait
    const istilahData = await loadIstilahSastrawan(data.id);

    // Panggil fungsi pembentukan JSON-LD Schema setelah seluruh data siap
    updatePersonSchema(
        data,
        karyaData,
        penghargaanData,
        artikelData
    );

    // Perbarui navigasi breadcrumb dan struktur datanya
    updateBreadcrumb(data);

    // Inisialisasi wadah penampung karya berdasarkan jenisnya
    let karyaPerJenis = {
        Puisi: [],
        Novel: [],
        Cerpen: [],
        Drama: [],
        Esai: []
    };

    // Kelompokkan data hasil query ke wadah objek masing-masing kategori
    karyaData.forEach(function(item) {
        if (item.karya) {
            const karya = item.karya;
            
            // Antisipasi jika ada jenis karya di luar kategori utama
            if (!karyaPerJenis[karya.jenis]) {
                karyaPerJenis[karya.jenis] = [];
            }
            
            karyaPerJenis[karya.jenis].push(karya);
        }
    });

    // Render struktur markup HTML komponen detail ke dalam halaman web
    container.innerHTML = `
    <article class="detail-sastrawan">
        ${
            data.foto
            ? `
              <img
                  src="${data.foto}"
                  alt="${data.nama}"
                  class="detail-foto"
              >
              `
            : ""
        }

        <h1>${data.nama}</h1>

        <div class="info-ringkas">
            <p>
                <strong>Tempat Lahir:</strong> 
                ${data.tempat_lahir || "-"}
            </p>
            <p>
                <strong>Tanggal Lahir:</strong> 
                ${data.tanggal_lahir || "-"}
            </p>
            <p>
                <strong>Tanggal Wafat:</strong> 
                ${data.tanggal_wafat || "-"}
            </p>
            <p>
                <strong>Angkatan:</strong> 
                ${data.angkatan || "-"}
            </p>
            <p>
                <strong>Aliran:</strong> 
                ${data.aliran || "-"}
            </p>
            <p>
                <strong>Jenis:</strong>
                ${
                    Array.isArray(data.jenis)
                    ? data.jenis.join(", ")
                    : "-"
                }
            </p>
        </div>

        <section>
            <h2>Biografi Singkat</h2>
            <p>${data.biografi_singkat || "-"}</p>
        </section>

        <section>
            <h2>Biografi Lengkap</h2>
            <div>
                ${(data.biografi_lengkap || "").replace(/\n/g, "<br>")}
            </div>
        </section>

        <section>
            <h2>Karya Sastra</h2>
            ${renderKategoriKarya("Puisi", karyaPerJenis.Puisi)}
            ${renderKategoriKarya("Novel", karyaPerJenis.Novel)}
            ${renderKategoriKarya("Cerpen", karyaPerJenis.Cerpen)}
            ${renderKategoriKarya("Drama", karyaPerJenis.Drama)}
            ${renderKategoriKarya("Esai", karyaPerJenis.Esai)}
        </section>

        <section>
            <h2>Istilah Sastra yang Sering Digunakan</h2>
            ${renderIstilah(istilahData)}
        </section>

        <section>
            <h2>Penghargaan</h2>
            ${renderPenghargaan(penghargaanData)}
        </section>

        <section>
            <h2>Sastrawan Terkait</h2>
            ${renderSastrawanTerkait(sastrawanTerkait)}
        </section>

        <section>
            <h2>Referensi Academic</h2>
            ${renderReferensi(referensiData)}
        </section>

        <section>
            <h2>Artikel Terkait</h2>
            ${renderArtikel(artikelData)}
        </section>

        <section>
            <h2>Jelajahi Selengkapnya</h2>
            ${renderInternalLink(karyaData, artikelData)}
        </section>
    </article>
    `;

    // ==================================================
    // INISIALISASI TOMBOL BOOKMARK SASTRAWAN
    // ==================================================
    initBookmarkButton(
        createBookmarkItem({
            tipe: "sastrawan",
            slug: data.slug,
            judul: data.nama
        })
    );
}

// ==========================================
// HELPER FUNCTION UNTUK UPDATE SEO DINAMIS
// ==========================================
function updateSEO(data){

    const title =
        `${data.nama} - Biografi, Karya, Penghargaan | Portal Sastra Indonesia`;

    const description =
        `${data.nama} merupakan sastrawan Indonesia ${data.angkatan || ""}. Temukan biografi lengkap, karya sastra, penghargaan, referensi akademik, serta artikel terkait di Portal Sastra Indonesia.`;

    document.title = title;

    document
        .getElementById(
            "meta-description"
        )
        .setAttribute(
            "content",
            description
        );

    // Canonical
    const canonical =
        window.location.href;

    document
        .getElementById(
            "canonical-url"
        )
        .href =
        canonical;

    // Open Graph
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
        canonical;

    document
        .getElementById(
            "og-image"
        )
        .content =
        data.foto || "";

    // Twitter
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

    document
        .getElementById(
            "twitter-image"
        )
        .content =
        data.foto || "";

}

// ==========================================
// SCHEMA.ORG PERSON (JSON-LD)
// ==========================================
function updatePersonSchema(
    data,
    karyaData,
    penghargaanData,
    artikelData
){
    const karya = karyaData
        .filter(item => item.karya)
        .map(item=>({
            "@type":"CreativeWork",
            "name":item.karya.judul,
            "url":
            `${location.origin}/karya-sastra/detail.html?slug=${item.karya.slug}`
        }));

    const penghargaan =
        penghargaanData.map(
            item=>item.nama
        );

    const artikel = artikelData
        .filter(item=>item.artikel)
        .map(item=>({
            "@type":"Article",
            "headline":item.artikel.judul,
            "url":
            `${location.origin}/artikel/detail.html?slug=${item.artikel.slug}`
        }));

    const schema = {
        "@context":
        "https://schema.org",
        "@type":
        "Person",
        "name":
        data.nama,
        "url":
        window.location.href,
        "image":
        data.foto || "",
        "description":
        data.biografi_singkat ||
        "",
        "birthDate":
        data.tanggal_lahir ||
        undefined,
        "deathDate":
        data.tanggal_wafat ||
        undefined,
        "birthPlace":
        data.tempat_lahir
        ?
        {
            "@type":"Place",
            "name":
            data.tempat_lahir
        }
        :
        undefined,
        "jobTitle":
        Array.isArray(data.jenis)
        ?
        data.jenis.join(", ")
        :
        "",
        "knowsAbout":[
            data.aliran,
            data.angkatan,
            ...(data.jenis || [])
        ].filter(Boolean),
        "award":
        penghargaan,
        "subjectOf":
        artikel,
        "hasPart":
        karya
    };

    document
        .getElementById(
            "person-schema"
        )
        .textContent =
        JSON.stringify(
            schema,
            null,
            2
        );
}

// ==========================================
// UPDATE BREADCRUMB
// ==========================================
function updateBreadcrumb(data){
    // Memanggil fungsi global renderBreadcrumb sesuai instruksi Langkah 5
    renderBreadcrumb([
        {
            label: "Beranda",
            href: "/index.html"
        },
        {
            label: "Sastrawan",
            href: "/sastrawan/index.html"
        },
        {
            label: data.nama
        }
    ]);

    updateBreadcrumbSchema(data);
}

// ==========================================
// BREADCRUMB SCHEMA
// ==========================================
function updateBreadcrumbSchema(data){
    const schema = {
        "@context":
        "https://schema.org",
        "@type":
        "BreadcrumbList",
        "itemListElement":[
            {
                "@type":
                "ListItem",
                "position":1,
                "name":
                "Beranda",
                "item":
                `${location.origin}/`
            },
            {
                "@type":
                "ListItem",
                "position":2,
                "name":
                "Sastrawan",
                "item":
                `${location.origin}/sastrawan/`
            },
            {
                "@type":
                "ListItem",
                "position":3,
                "name":
                data.nama,
                "item":
                window.location.href
            }
        ]
    };

    document
        .getElementById(
            "breadcrumb-schema"
        )
        .textContent =
        JSON.stringify(
            schema,
            null,
            2
        );
}

// ==========================================
// 3. FUNGSI FETCH RELASI MANY-TO-MANY KARYA
// ==========================================
async function loadKaryaSastrawan(sastrawanId) {
    const { data, error } = await supabaseClient
        .from("sastrawan_karya")
        .select(`
            karya_id,
            karya (
                id,
                judul,
                slug,
                jenis,
                tahun
            )
        `)
        .eq("sastrawan_id", sastrawanId);

    if (error) {
        console.error("Gagal memuat relasi karya sastrawan:", error);
        return [];
    }

    return data;
}

// ==========================================
// LOAD PENGHARGAAN SASTRAWAN
// ==========================================
async function loadPenghargaanSastrawan(sastrawanId) {
    const { data, error } = await supabaseClient
        .from("penghargaan_sastrawan")
        .select("*")
        .eq("sastrawan_id", sastrawanId)
        .order("tahun", { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

// ==========================================
// LOAD REFERENSI AKADEMIK
// ==========================================
async function loadReferensiSastrawan(sastrawanId){
    const { data, error } = await supabaseClient
        .from("referensi_sastrawan")
        .select("*")
        .eq("sastrawan_id", sastrawanId)
        .order("tahun", { ascending:true });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

// ==========================================
// LOAD ARTIKEL TERKAIT
// ==========================================
async function loadArtikelSastrawan(sastrawanId){
    const { data, error } = await supabaseClient
        .from("artikel_sastrawan")
        .select(`
            artikel(
                id,
                judul,
                slug
            )
        `)
        .eq("sastrawan_id", sastrawanId);

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

// ==========================================
// LOAD ISTILAH SASTRA
// ==========================================
async function loadIstilahSastrawan(sastrawanId){

    const {
        data,
        error
    } =
    await supabaseClient
    .from("istilah_sastrawan")
    .select(`
        istilah(
            id,
            nama,
            slug
        )
    `)
    .eq(
        "sastrawan_id",
        sastrawanId
    );

    if(error){

        console.error(error);

        return [];

    }

    return data || [];

}

// ==========================================
// LOAD SASTRAWAN TERKAIT OTOMATIS
// ==========================================
async function loadSastrawanTerkait(sastrawan){
    const hasil = [];
    const ids = new Set();

    // ==================================
    // PRIORITAS 1: ANGKATAN + ALIRAN
    // ==================================
    const { data: utama } = await supabaseClient
        .from("sastrawan")
        .select("*")
        .eq("angkatan", sastrawan.angkatan)
        .eq("aliran", sastrawan.aliran)
        .neq("id", sastrawan.id);

    if(utama){
        utama.forEach(item=>{
            hasil.push(item);
            ids.add(item.id);
        });
    }

    // ==================================
    // PRIORITAS 2: ANGKATAN
    // ==================================
    if(hasil.length < 8){
        const { data: angkatan } = await supabaseClient
            .from("sastrawan")
            .select("*")
            .eq("angkatan", sastrawan.angkatan)
            .neq("id", sastrawan.id);

        if(angkatan){
            angkatan.forEach(item=>{
                if(!ids.has(item.id)){
                    hasil.push(item);
                    ids.add(item.id);
                }
            });
        }
    }

    // ==================================
    // PRIORITAS 3: ALIRAN
    // ==================================
    if(hasil.length < 8){
        const { data: aliran } = await supabaseClient
            .from("sastrawan")
            .select("*")
            .eq("aliran", sastrawan.aliran)
            .neq("id", sastrawan.id);

        if(aliran){
            aliran.forEach(item=>{
                if(!ids.has(item.id)){
                    hasil.push(item);
                    ids.add(item.id);
                }
            });
        }
    }

    return hasil.slice(0,8);
}

// ==========================================
// 4. HELPER FUNCTION RENDER KATEGORI KARYA
// ==========================================
function renderKategoriKarya(judul, daftar) {
    let html = `
        <section class="kategori-karya">
            <h3>${judul}</h3>
    `;

    if (daftar.length === 0) {
        html += `
            <p>-</p>
        `;
    } else {
        html += "<ul>";
        daftar.forEach(karya => {
            html += `
            <li>
                <a href="../karya-sastra/detail.html?slug=${karya.slug}">
                    ${karya.judul}
                </a>
                ${karya.tahun ? `(${karya.tahun})` : ""}
            </li>
            `;
        });
        html += "<ul>";
    }

    html += "</section>";
    return html;
}

// ==========================================
// RENDER ISTILAH
// ==========================================
function renderIstilah(data){

    if(data.length === 0){

        return `
        <p>
            Belum ada istilah terkait.
        </p>
        `;

    }

    let html = "<ul>";

    data.forEach(item=>{

        if(!item.istilah)
            return;

        html += `

        <li>

        <a href="../kamus-istilah/detail.html?slug=${item.istilah.slug}">

        ${item.istilah.nama}

        </a>

        </li>

        `;

    });

    html += "</ul>";

    return html;

}

// ==========================================
// RENDER PENGHARGAAN
// ==========================================
function renderPenghargaan(data) {
    if (data.length === 0) {
        return `
            <p>Belum ada penghargaan.</p>
        `;
    }

    let html = "<ul>";
    data.forEach(item => {
        html += `
            <li>
                <strong>${item.nama}</strong>
                ${item.tahun ? `(${item.tahun})` : ""}
                ${
                    item.keterangan
                    ? `<br><small>${item.keterangan}</small>`
                    : ""
                }
            </li>
        `;
    });
    html += "</ul>";
    return html;
}

// ==========================================
// RENDER SASTRAWAN TERKAIT
// ==========================================
function renderSastrawanTerkait(data){
    if(data.length===0){
        return `
            <p>Belum ada sastrawan terkait.</p>
        `;
    }

    let html="<ul>";
    data.forEach(item=>{
        html+=`
            <li>
                <a href="detail.html?slug=${item.slug}">
                    ${item.nama}
                </a>
                <br>
                <small>
                    ${item.angkatan} • ${item.aliran}
                </small>
            </li>
        `;
    });
    html+="</ul>";
    return html;
}

// ==========================================
// RENDER REFERENSI AKADEMIK
// ==========================================
function renderReferensi(data){
    if(data.length===0){
        return `
            <p>Belum ada referensi akademik.</p>
        `;
    }

    let html="<ol>";
    data.forEach(item=>{
        html+=`
            <li style="margin-bottom:18px;">
                <strong>${item.penulis}</strong>
                <br>
                <em>${item.judul}</em>
                ${
                    item.penerbit
                    ? `<br>${item.penerbit}`
                    : ""
                }
                ${
                    item.tahun
                    ? `(${item.tahun})`
                    : ""
                }
                ${
                    item.url
                    ? `
                    <br>
                    <a href="${item.url}" target="_blank">
                        Lihat Referensi
                    </a>
                    `
                    : ""
                }
            </li>
        `;
    });
    html+="</ol>";
    return html;
}

// ==========================================
// RENDER ARTIKEL TERKAIT
// ==========================================
function renderArtikel(data){
    if(data.length===0){
        return `
            <p>
                Belum ada artikel terkait.
            </p>
        `;
    }

    let html="<ul>";

    data.forEach(item=>{
        if(!item.artikel) return;

        html+=`
            <li>
                <a href="../artikel/detail.html?slug=${item.artikel.slug}">
                    ${item.artikel.judul}
                </a>
            </li>
        `;
    });

    html+="</ul>";
    return html;
}

// ==========================================
// INTERNAL LINKING
// ==========================================
function renderInternalLink(karyaData, artikelData){
    let html = "";

    //-------------------------------------------------
    // KARYA
    //-------------------------------------------------
    html += `
    <div class="internal-box">
        <h3>Karya Sastra</h3>
    `;

    if(karyaData.length){
        html += "<ul>";
        karyaData.forEach(item=>{
            if(!item.karya) return;
            html += `
            <li>
                <a href="../karya-sastra/detail.html?slug=${item.karya.slug}">
                    ${item.karya.judul}
                </a>
            </li>
            `;
        });
        html += "</ul>";
    }else{
        html += "<p>-</p>";
    }
    html += "</div>";

    //-------------------------------------------------
    // ARTIKEL
    //-------------------------------------------------
    html += `
    <div class="internal-box">
        <h3>Artikel Sastra</h3>
    `;

    if(artikelData.length){
        html += "<ul>";
        artikelData.forEach(item=>{
            if(!item.artikel) return;
            html += `
            <li>
                <a href="../artikel/detail.html?slug=${item.artikel.slug}">
                    ${item.artikel.judul}
                </a>
            </li>
            `;
        });
        html += "</ul>";
    }else{
        html += "<p>-</p>";
    }
    html += "</div>";

    return html;
}