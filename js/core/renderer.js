// ====================================
// CORE URL GENERATOR (DYNAMIC ROUTING)
// ====================================

/**
 * Membuat URL secara dinamis berdasarkan tipe dan slug data.
 * Mencegah kerusakan bookmark jika struktur URL/file HTML berubah di masa depan.
 * @param {Object} item - Objek data yang minimal memiliki properti 'tipe' dan 'slug'
 * @returns {string} URL tujuan detail halaman
 */
function getBookmarkUrl(item) {
    if (!item || !item.tipe || !item.slug) {
        return "#";
    }

    switch (item.tipe) {
        case "istilah":
            return `/kamus-istilah/detail.html?slug=${item.slug}`;
        case "artikel":
            return `/artikel/detail.html?slug=${item.slug}`;
        case "sastrawan":
            return `/sastrawan/detail.html?slug=${item.slug}`;
        case "karya":
            return `/karya-sastra/detail.html?slug=${item.slug}`;
        default:
            return "#";
    }
}

// ====================================
// HOME CARD RENDERER
// ====================================

function renderHomeCard({
    badge,
    title,
    description,
    tipe,
    slug,
    url: fallbackUrl, // Tetap mempertahankan parameter url lama sebagai fallback jika tipe & slug belum dipasing
    buttonText
}) {
    // Generate URL secara dinamis jika parameter tipe dan slug tersedia
    const targetUrl = (tipe && slug) ? getBookmarkUrl({ tipe, slug }) : fallbackUrl;

    return `
        <article class="home-card">
            <span class="card-badge">
                ${escapeHtml(badge)}
            </span>

            <h3>
                <a href="${targetUrl}">
                    ${escapeHtml(title)}
                </a>
            </h3>

            <p>
                ${potongTeks(description, 140)}
            </p>

            <a
                class="home-link"
                href="${targetUrl}"
            >
                ${buttonText}
            </a>
        </article>
    `;
}

// ====================================
// BOOKMARK CARD RENDERER (DRAFT/CONTOH)
// ====================================

function renderBookmarkCard(item) {
    // Menggunakan getBookmarkUrl daripada item.url yang kaku dari database
    const dynamicUrl = getBookmarkUrl(item);

    return `
        <article class="bookmark-card">
            <h3>
                <a href="${dynamicUrl}">
                    ${escapeHtml(item.judul || item.title)}
                </a>
            </h3>
            <span class="card-badge">${escapeHtml(item.tipe)}</span>
            </article>
    `;
}