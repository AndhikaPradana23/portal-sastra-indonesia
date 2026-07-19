// ==========================================
// VARIABEL GLOBAL
// ==========================================
let kategoriAktif = "";
let tagAktif = "";
let keywordAktif = "";
let halamanAktif = 1;
const ARTIKEL_PER_HALAMAN = 10;
let totalHalaman = 1;
let semuaArtikel = [];

// ==========================================
// INITIALISASI HALAMAN
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadLayout();

        if (typeof renderBreadcrumb === "function") {

            renderBreadcrumb([
                {
                    label: "Beranda",
                    href: "/",
                    icon: "/assets/icons/house.svg"
                },
                {
                    label: "Artikel",
                    icon: "/assets/icons/newspaper.svg"
                }
            ]);

        }

        updateSEO();

        await loadKategori();

        await loadTag();

        await loadArtikel();

        await loadArtikelPopuler();

        await loadArtikelTerbaru();

    }
);

// ==========================================
// FILTER KATEGORI
// ==========================================
document.addEventListener(
    "click",
    async (event) => {

        const btn =
            event.target.closest(".kategori-btn");

        if (!btn) return;

        document
            .querySelectorAll(".kategori-btn")
            .forEach(item =>
                item.classList.remove("aktif")
            );

        btn.classList.add("aktif");

        kategoriAktif =
            btn.dataset.kategori;

        halamanAktif = 1;

        await loadArtikel();

    }
);

// ==========================================
// FILTER TAG
// ==========================================
document.addEventListener(
    "click",
    async (event) => {

        const btn =
            event.target.closest(".tag-btn");

        if (!btn) return;

        document
            .querySelectorAll(".tag-btn")
            .forEach(item =>
                item.classList.remove("aktif")
            );

        btn.classList.add("aktif");

        tagAktif =
            btn.dataset.tag;

        halamanAktif = 1;

        await loadArtikel();

    }
);

// ==========================================
// SEARCH REALTIME
// ==========================================
document.addEventListener(
    "input",
    debounce(async (event) => {

        if (
            event.target.id !==
            "search-artikel"
        ) return;

        keywordAktif =
            event.target.value.trim();

        halamanAktif = 1;

        await loadArtikel();

    }, 350)
);

// ==========================================
// PAGINATION
// ==========================================
document.addEventListener(
    "click",
    async (event) => {

        const btn =
            event.target.closest(".pagination-btn");

        if (!btn) return;

        const halaman =
            Number(btn.dataset.page);

        if (
            halaman === halamanAktif
        ) return;

        halamanAktif = halaman;

        await loadArtikel();

        window.scrollTo({
            top:
                document.querySelector(
                    ".artikel-layout"
                ).offsetTop - 90,
            behavior: "smooth"
        });

    }
);

// ==========================================
// HELPER DEBOUNCE
// ==========================================
function debounce(callback, delay = 300) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(
            () => callback(...args),
            delay
        );

    };

}

// ==========================================
// LOAD FILTER KATEGORI
// ==========================================
async function loadKategori() {

    const container =
        document.getElementById(
            "kategori-filter"
        );

    container.innerHTML = `
        <span class="badge badge-primary">
            Memuat kategori...
        </span>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .from("artikel")
        .select("kategori");

    if (error) {

        console.error(error);

        container.innerHTML = `
            <span class="badge badge-danger">
                Gagal memuat kategori
            </span>
        `;

        return;

    }

    const kategoriUnik = [
        ...new Set(
            data
                .map(item => item.kategori)
                .filter(Boolean)
        )
    ].sort();

    container.innerHTML = `
        <button
            class="kategori-btn aktif"
            data-kategori=""
        >
            <img
                src="/assets/icons/layout-grid.svg"
                class="filter-icon"
                alt=""
            >
            Semua
        </button>

        ${kategoriUnik.map(item => `
            <button
                class="kategori-btn"
                data-kategori="${item}"
            >
                <img
                    src="/assets/icons/folder.svg"
                    class="filter-icon"
                    alt=""
                >
                ${item}
            </button>
        `).join("")}
    `;

}

// ==========================================
// LOAD FILTER TAG
// ==========================================
async function loadTag() {

    const container =
        document.getElementById(
            "tag-filter"
        );

    container.innerHTML = `
        <span class="badge badge-primary">
            Memuat tag...
        </span>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .from("artikel")
        .select("tag");

    if (error) {

        console.error(error);

        container.innerHTML = `
            <span class="badge badge-danger">
                Gagal memuat tag
            </span>
        `;

        return;

    }

    const semuaTag = [];

    data.forEach(item => {

        if (Array.isArray(item.tag)) {

            semuaTag.push(
                ...item.tag
            );

        }

    });

    const tagUnik = [
        ...new Set(semuaTag)
    ].sort();

    container.innerHTML = `
        <button
            class="tag-btn aktif"
            data-tag=""
        >
            <img
                src="/assets/icons/tags.svg"
                class="filter-icon"
                alt=""
            >
            Semua
        </button>

        ${tagUnik.map(tag => `
            <button
                class="tag-btn"
                data-tag="${tag}"
            >
                <img
                    src="/assets/icons/tag.svg"
                    class="filter-icon"
                    alt=""
                >
                ${tag}
            </button>
        `).join("")}
    `;

}

// ==========================================
// LOAD ARTIKEL + PAGINATION
// ==========================================
async function loadArtikel(
    kategori = "",
    tag = "",
    keyword = ""
) {

    const container =
        document.getElementById(
            "artikel-list"
        );

    const pagination =
        document.getElementById(
            "pagination"
        );

    container.innerHTML = `
        <div class="card skeleton" style="height:220px;"></div>
        <div class="card skeleton" style="height:220px;"></div>
        <div class="card skeleton" style="height:220px;"></div>
    `;

    if (pagination) {
        pagination.innerHTML = "";
    }

    let query =
        supabaseClient
        .from("artikel")
        .select("*", {
            count: "exact"
        });

    // =========================
    // FILTER
    // =========================

    if (kategoriAktif) {
        query = query.eq(
            "kategori",
            kategoriAktif
        );
    }

    if (tagAktif) {
        query = query.contains(
            "tag",
            [tagAktif]
        );
    }

    if (keywordAktif) {

        query = query.or(
            `judul.ilike.%${keywordAktif}%,ringkasan.ilike.%${keywordAktif}%,isi.ilike.%${keywordAktif}%`
        );

    }

    // =========================
    // PAGINATION
    // =========================

    const from =
        (halamanAktif - 1)
        * ARTIKEL_PER_HALAMAN;

    const to =
        from +
        ARTIKEL_PER_HALAMAN -
        1;

    const {
        data,
        error,
        count
    } =
        await query
            .order(
                "published_at",
                {
                    ascending: false
                }
            )
            .range(
                from,
                to
            );

    if (error) {

        console.error(error);

        container.innerHTML = `
            <div class="card">
                <p>Gagal memuat artikel.</p>
            </div>
        `;

        return;

    }

    if (!data || !data.length) {

        container.innerHTML = `
            <div class="card">
                <h3>
                    Artikel tidak ditemukan
                </h3>

                <p>
                    Tidak ada artikel yang sesuai
                    dengan filter yang dipilih.
                </p>
            </div>
        `;

        return;

    }

    // =========================
    // RENDER CARD
    // =========================

    container.innerHTML =
        data.map(item => `

<article class="post-card card fade-up">

    <div class="post-top">

        <span class="badge badge-primary">

            <img
                src="/assets/icons/folder.svg"
                class="badge-icon"
                alt="">

            ${item.kategori ?? "Artikel"}

        </span>

    </div>

    <h2>

        <img
            src="/assets/icons/newspaper.svg"
            class="title-icon"
            alt="">

        ${item.judul}

    </h2>

    <p>

        ${
            (item.ringkasan || "")
            .length > 220
            ? item.ringkasan.substring(0,220) + "..."
            : (item.ringkasan || "")
        }

    </p>

    <div class="post-footer">

        <small>

            <img
                src="/assets/icons/calendar.svg"
                class="meta-icon"
                alt="">

            ${
                item.published_at
                ? new Date(
                    item.published_at
                ).toLocaleDateString(
                    "id-ID",
                    {
                        day:"numeric",
                        month:"long",
                        year:"numeric"
                    }
                )
                : "-"
            }

        </small>

        <small>

            <img
                src="/assets/icons/eye.svg"
                class="meta-icon"
                alt="">

            ${item.views || 0}

        </small>

    </div>

    <a
        class="btn btn-primary"
        href="detail.html?slug=${item.slug}"
    >

        <img
            src="/assets/icons/book-open.svg"
            class="btn-icon"
            alt="">

        Baca Selengkapnya

    </a>

</article>

        `).join("");

    // =========================
    // PAGINATION
    // =========================

    totalHalaman =
        Math.ceil(
            count /
            ARTIKEL_PER_HALAMAN
        );

    if (
        pagination &&
        totalHalaman > 1
    ) {

        renderPagination();

    }

}

// ==========================================
// SIDEBAR ARTIKEL POPULER
// ==========================================
async function loadArtikelPopuler() {

    const container =
        document.getElementById(
            "artikel-populer"
        );

    container.innerHTML = `
        <div class="sidebar-loading">
            Memuat artikel populer...
        </div>
    `;

    const {
        data,
        error
    } =
        await supabaseClient
            .from("artikel")
            .select(`
                judul,
                slug,
                views,
                published_at
            `)
            .order(
                "views",
                {
                    ascending: false
                }
            )
            .limit(5);

    if (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Gagal memuat artikel populer.
            </p>
        `;

        return;

    }

    if (!data || !data.length) {

        container.innerHTML = `
            <p>
                Belum ada artikel.
            </p>
        `;

        return;

    }

    container.innerHTML = data.map((item, index) => `

        <article class="sidebar-post">

            <div class="sidebar-number">

                ${index + 1}

            </div>

            <div class="sidebar-content">

                <a
                    class="sidebar-title"
                    href="detail.html?slug=${item.slug}"
                >
                    ${item.judul}
                </a>

                <div class="sidebar-meta">

                    <span>

                        <img
                            src="/assets/icons/eye.svg"
                            class="meta-icon"
                            alt=""
                        >

                        ${item.views || 0}

                    </span>

                    <span>

                        <img
                            src="/assets/icons/calendar.svg"
                            class="meta-icon"
                            alt=""
                        >

                        ${
                            item.published_at
                            ? new Date(
                                item.published_at
                            ).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "short"
                                }
                            )
                            : "-"
                        }

                    </span>

                </div>

            </div>

        </article>

    `).join("");

}

// ==========================================
// SIDEBAR ARTIKEL TERBARU
// ==========================================
async function loadArtikelTerbaru() {

    const container =
        document.getElementById(
            "artikel-terbaru"
        );

    container.innerHTML = `
        <div class="sidebar-loading">
            Memuat artikel terbaru...
        </div>
    `;

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
                    ascending: false
                }
            )
            .limit(5);

    if (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Gagal memuat artikel terbaru.
            </p>
        `;

        return;

    }

    if (!data || !data.length) {

        container.innerHTML = `
            <p>
                Belum ada artikel.
            </p>
        `;

        return;

    }

    container.innerHTML = data.map(item => `

        <article class="sidebar-post">

            <div class="sidebar-icon">

                <img
                    src="/assets/icons/newspaper.svg"
                    alt=""
                >

            </div>

            <div class="sidebar-content">

                <a
                    class="sidebar-title"
                    href="detail.html?slug=${item.slug}"
                >
                    ${item.judul}
                </a>

                <div class="sidebar-meta">

                    <span>

                        <img
                            src="/assets/icons/calendar.svg"
                            class="meta-icon"
                            alt=""
                        >

                        ${
                            new Date(
                                item.published_at
                            ).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                }
                            )
                        }

                    </span>

                </div>

            </div>

        </article>

    `).join("");

}

// ==========================================
// RENDER PAGINATION
// ==========================================
function renderPagination() {

    const container =
        document.getElementById(
            "pagination"
        );

    if (!container) return;

    if (totalHalaman <= 1) {

        container.innerHTML = "";

        return;

    }

    let html = "";

    // Tombol Sebelumnya
    html += `
        <button
            class="pagination-btn"
            data-page="${halamanAktif - 1}"
            ${halamanAktif === 1 ? "disabled" : ""}
        >
            &laquo;
        </button>
    `;

    // Nomor Halaman
    for (
        let i = 1;
        i <= totalHalaman;
        i++
    ) {

        html += `
            <button
                class="pagination-btn ${i === halamanAktif ? "aktif" : ""}"
                data-page="${i}"
            >
                ${i}
            </button>
        `;

    }

    // Tombol Berikutnya
    html += `
        <button
            class="pagination-btn"
            data-page="${halamanAktif + 1}"
            ${halamanAktif === totalHalaman ? "disabled" : ""}
        >
            &raquo;
        </button>
    `;

    container.innerHTML = html;

}

// ==========================================
// TRUNCATE TEXT
// ==========================================
function truncateText(
    text = "",
    max = 180
) {

    if (!text) return "";

    if (text.length <= max)
        return text;

    return (
        text.substring(
            0,
            max
        ) + "..."
    );

}

// ==========================================
// FORMAT TANGGAL
// ==========================================
function formatTanggal(
    tanggal
) {

    if (!tanggal)
        return "-";

    return new Date(
        tanggal
    ).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}

// ==========================================
// ESCAPE HTML
// ==========================================
function escapeHTML(
    text = ""
) {

    return text
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}

// ==========================================
// SEO HALAMAN ARTIKEL
// ==========================================
function updateSEO() {

    const title =
        "Artikel Sastra Indonesia | Portal Sastra Indonesia";

    const description =
        "Baca artikel sastra Indonesia seputar puisi, cerpen, novel, drama, kritik sastra, teori sastra, bahasa Indonesia, dan kajian akademik.";

    const url =
        window.location.href;

    document.title = title;

    document
        .getElementById(
            "meta-description"
        )
        .setAttribute(
            "content",
            description
        );

    document
        .getElementById(
            "canonical-url"
        )
        .setAttribute(
            "href",
            url
        );

    document
        .getElementById(
            "og-title"
        )
        .setAttribute(
            "content",
            title
        );

    document
        .getElementById(
            "og-description"
        )
        .setAttribute(
            "content",
            description
        );

    document
        .getElementById(
            "og-url"
        )
        .setAttribute(
            "content",
            url
        );

    document
        .getElementById(
            "twitter-title"
        )
        .setAttribute(
            "content",
            title
        );

    document
        .getElementById(
            "twitter-description"
        )
        .setAttribute(
            "content",
            description
        );

}