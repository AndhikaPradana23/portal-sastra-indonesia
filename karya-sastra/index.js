// ==========================================
// 1. VARIABEL GLOBAL & EVENT LISTENERS
// ==========================================
let jenisAktif = "";
let tahunAktif = "";
let penulisAktif = "";
let genreAktif = "";

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memuat layout utama terlebih dahulu
        await loadLayout();

        // Panggil fungsi global renderBreadcrumb (Menggunakan format ikon terbaru)
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Karya Sastra",
                icon: "/assets/icons/book-open.svg"
            }
        ]);

        updateSEO();
        
        await loadDaftarPenulis();
        await loadDaftarGenre();
        
        loadKarya(
            jenisAktif,
            tahunAktif,
            penulisAktif,
            genreAktif
        );
    }
);

document.addEventListener(
    "click",
    event => {
        if (
            event.target.classList.contains(
                "jenis-btn"
            )
        ) {
            document
                .querySelectorAll(
                    ".jenis-btn"
                )
                .forEach(
                    btn =>
                    btn.classList.remove(
                        "aktif"
                    )
                );

            event.target.classList.add(
                "aktif"
            );

            jenisAktif =
                event.target.dataset.jenis;

            loadKarya(
                jenisAktif,
                tahunAktif,
                penulisAktif,
                genreAktif
            );
        }
    }
);

document.addEventListener(
    "change",
    event => {
        if (
            event.target.id ===
            "tahun-filter"
        ) {
            tahunAktif =
                event.target.value;

            loadKarya(
                jenisAktif,
                tahunAktif,
                penulisAktif,
                genreAktif
            );
        }
    }
);

document.addEventListener(
    "change",
    event => {
        if (
            event.target.id ===
            "penulis-filter"
        ) {
            penulisAktif =
                event.target.value;

            loadKarya(
                jenisAktif,
                tahunAktif,
                penulisAktif,
                genreAktif
            );
        }
    }
);

document.addEventListener(
    "change",
    event => {
        if (
            event.target.id ===
            "genre-filter"
        ) {
            genreAktif =
                event.target.value;

            loadKarya(
                jenisAktif,
                tahunAktif,
                penulisAktif,
                genreAktif
            );
        }
    }
);

// ==========================================
// 2. FUNGSI UTAMA LOAD DAFTAR PENULIS (DROPDOWN)
// ==========================================
async function loadDaftarPenulis() {
    const select = document.getElementById("penulis-filter");
    
    if (!select) return;

    const { data, error } = await supabaseClient
        .from("sastrawan")
        .select("id, nama")
        .order("nama");

    if (error) {
        console.error(error);
        return;
    }

    select.innerHTML = `
    <option value="">
        Semua Penulis
    </option>
    ` +
    data.map(item => `
        <option value="${item.id}">
            ${item.nama}
        </option>
    `).join("");
}

// ==========================================
// LOAD DAFTAR GENRE
// ==========================================
async function loadDaftarGenre() {
    const select = document.getElementById("genre-filter");

    if (!select) return;

    const { data, error } = await supabaseClient
        .from("karya")
        .select("genre")
        .not("genre", "is", null)
        .order("genre");

    if (error) {
        console.error(error);
        return;
    }

    const daftarGenre = [
        ...new Set(
            data
                .map(item => item.genre?.trim())
                .filter(item => item)
        )
    ];

    select.innerHTML = `
        <option value="">
            Semua Genre
        </option>
    `;

    daftarGenre.forEach(item => {
        select.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;
    });
}

// ==========================================
// 3. FUNGSI UTAMA LOAD KARYA (DENGAN MULTI FILTER)
// ==========================================
async function loadKarya(jenis = "", periode = "", penulis = "", genre = "") {
    const container = document.getElementById("karya-container");
    
    if (!container) {
        console.error("Elemen #karya-container tidak ditemukan");
        return;
    }

    container.innerHTML = `<div class="loading">Memuat data...</div>`;

    // Bangun query dasar Supabase
    let query = supabaseClient
        .from("karya")
        .select("*");

    // Terapkan filter jika parameter jenis dikirim/aktif
    if (jenis) {
        query = query.eq(
            "jenis",
            jenis
        );
    }

    // Terapkan filter rentang tahun jika parameter periode dikirim/aktif
    if (periode) {
        const pecah = periode.split("-");
        const awal = parseInt(pecah[0]);
        const akhir = parseInt(pecah[1]);

        query = query
            .gte("tahun", awal)
            .lte("tahun", akhir);
    }

    // Terapkan filter berdasarkan penulis (relasi many-to-many)
    if (penulis) {
        const { data: relasi, error } = await supabaseClient
            .from("sastrawan_karya")
            .select("karya_id")
            .eq("sastrawan_id", penulis);

        if (error) {
            console.error(error);
            container.innerHTML = `<div class="error">Gagal memuat data.</div>`;
            return;
        }

        const daftarId = relasi.map(item => item.karya_id);

        if (daftarId.length === 0) {
            container.innerHTML = `
                <div class="kosong">
                    Tidak ada karya.
                </div>
            `;
            return;
        }

        query = query.in("id", daftarId);
    }

    // Terapkan filter genre
    if (genre) {
        query = query.eq(
            "genre",
            genre
        );
    }

    // Eksekusi query dengan pengurutan berdasarkan judul
    const { data, error } = await query.order("judul");

    if (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error">
                Gagal memuat data karya sastra.
            </div>
        `;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="kosong">
                Belum ada karya sastra yang sesuai dengan filter yang dipilih.
            </div>
        `;
        return;
    }

    // Render data ke dalam container
    container.innerHTML = renderKaryaList(data);
}

// ==========================================
// 4. HELPER RENDERER COMPONENTS
// ==========================================
function renderKaryaList(data) {
    let html = `<div class="karya-grid">`;

    data.forEach(item => {
        html += `
            <div class="karya-card">
                <h3>${item.judul}</h3>
                <p><strong>Tahun :</strong> ${item.tahun || "-"}</p>
                
                <p>
                    <strong>Jenis :</strong>
                    ${item.jenis || "-"}
                </p>
                ${
                    item.genre
                        ? `
                        <p>
                            <strong>Genre :</strong>
                            ${item.genre}
                        </p>
                        `
                        : ""
                }
                
                <div class="card-action">
                    <a href="detail.html?slug=${item.slug}" class="btn-detail">
                        Lihat Detail
                    </a>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

// ==========================================
// 5. OPTIMASI SEO & CANONICAL URL
// ==========================================
function updateSEO() {
    const currentUrl = window.location.href;

    // Set canonical URL secara dinamis
    const canonicalLink = document.getElementById("canonical-url");
    if (canonicalLink) canonicalLink.href = currentUrl;

    // Set Open Graph Meta Tags
    const ogTitle = document.getElementById("og-title");
    if (ogTitle) ogTitle.content = document.title;

    const ogDescription = document.getElementById("og-description");
    const metaDesc = document.getElementById("meta-description");
    if (ogDescription && metaDesc) ogDescription.content = metaDesc.content;

    const ogUrl = document.getElementById("og-url");
    if (ogUrl) ogUrl.content = currentUrl;

    // Set Twitter Meta Tags
    const twitterTitle = document.getElementById("twitter-title");
    if (twitterTitle) twitterTitle.content = document.title;

    const twitterDescription = document.getElementById("twitter-description");
    if (twitterDescription && metaDesc) twitterDescription.content = metaDesc.content;
}