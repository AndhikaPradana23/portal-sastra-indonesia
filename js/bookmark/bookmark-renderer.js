// ==========================================================================
// BOOKMARK RENDERER
// ==========================================================================

/**
 * Merender daftar semua item bookmark ke dalam kontainer HTML.
 * @param {Array} list - Array berisi objek-objek data bookmark
 */
function renderBookmarkList(list){
    const container =
        document.getElementById(
            "bookmark-list"
        );

    // Validasi jika data kosong
    if(!list.length){
        container.innerHTML=`
        <p>
            Belum ada bookmark.
        </p>
        `;
        return;
    }

    // Gabungkan seluruh hasil render card ke dalam kontainer
    container.innerHTML=
        list.map(
            renderBookmarkCard
        ).join("");
}

/**
 * LANGKAH 4: Komponen renderer untuk membuat struktur HTML satu kartu bookmark.
 * Menggunakan getBookmarkUrl(item) secara dinamis alih-alih item.url statis.
 * @param {Object} item - Objek data bookmark individual
 * @returns {string} - String representasi elemen HTML <article>
 */
function renderBookmarkCard(item){
    // Merakit URL secara dinamis menggunakan fungsi generator
    const url = getBookmarkUrl(item);

    return `
    <article class="bookmark-card">
        <span class="bookmark-type">
            ${escapeHtml(item.tipe)}
        </span>

        <h3>
            <a href="${url}">
                ${escapeHtml(item.judul)}
            </a>
        </h3>

        <a
            class="bookmark-link"
            href="${url}"
        >
            Buka →
        </a>
    </article>
    `;
}