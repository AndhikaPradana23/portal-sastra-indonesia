// ==========================================================================
// BOOKMARK RENDERER
// ==========================================================================

/**
 * Langkah 3: Membuat dan memperbarui komponen visual ringkasan jumlah bookmark (Summary Grid).
 * Mengambil ringkasan data dari BookmarkService secara asinkron.
 */
async function renderBookmarkCount(){
    const total =
        document.getElementById(
            "bookmark-total"
        );

    const grid =
        document.getElementById(
            "bookmark-count-grid"
        );

    if(
        !total ||
        !grid
    ){
        return;
    }

    // Menggunakan await karena service mengambil data asinkron dari database
    const count =
        await BookmarkService
            .getBookmarkCount();

    const typeCount =
        await BookmarkService
            .getBookmarkCountByType();

    total.textContent =
        `${CoreHelpers.formatNumber(
            count
        )} Bookmark`;

    grid.innerHTML = `
        <article class="bookmark-count-card">
            <strong>
                ${CoreHelpers.formatNumber(
                    typeCount.istilah || 0
                )}
            </strong>
            <span>
                Istilah
            </span>
        </article>

        <article class="bookmark-count-card">
            <strong>
                ${CoreHelpers.formatNumber(
                    typeCount.artikel || 0
                )}
            </strong>
            <span>
                Artikel
            </span>
        </article>

        <article class="bookmark-count-card">
            <strong>
                ${CoreHelpers.formatNumber(
                    typeCount.sastrawan || 0
                )}
            </strong>
            <span>
                Sastrawan
            </span>
        </article>

        <article class="bookmark-count-card">
            <strong>
                ${CoreHelpers.formatNumber(
                    typeCount.karya || 0
                )}
            </strong>
            <span>
                Karya
            </span>
        </article>
    `;
}

/**
 * Merender daftar semua item bookmark ke dalam kontainer HTML.
 * @param {Array} list - Array berisi objek-objek data bookmark dari database
 */
function renderBookmarkList(list){
    const container =
        document.getElementById(
            "bookmark-list"
        );

    // ----------------------------------------------------------------------
    // LANGKAH 5: Filter Data Bookmark di Sisi Renderer
    // ----------------------------------------------------------------------
    let bookmarks = list || [];

    // Deteksi state global activeType secara dinamis demi keamanan runtime
    const activeType = typeof bookmarkType !== "undefined" ? bookmarkType : (typeof currentBookmarkType !== "undefined" ? currentBookmarkType : "all");
    
    // Deteksi state global keyword secara dinamis demi keamanan runtime
    const activeKeyword = typeof bookmarkKeyword !== "undefined" ? bookmarkKeyword : "";

    // 1. Saring berdasarkan Tipe Kategori
    if (activeType !== "all") {
        bookmarks = bookmarks.filter(
            item => (item.tipe || item.type) === activeType
        );
    }

    // 2. Saring berdasarkan Kata Kunci Pencarian
    if (activeKeyword) {
        bookmarks = bookmarks.filter(item => {
            const title = (item.judul || item.title || "").toLowerCase();
            return title.includes(activeKeyword);
        });
    }

    // ----------------------------------------------------------------------
    // LANGKAH 6: Empty State Lebih Pintar & Adaptif
    // ----------------------------------------------------------------------
    if (bookmarks.length === 0) {
        let title = "Belum ada bookmark";
        let message = "Tambahkan bookmark terlebih dahulu.";

        if (activeKeyword) {
            title = "Bookmark tidak ditemukan";
            message = `Tidak ada bookmark dengan kata kunci "${CoreHelpers.escapeHtml(activeKeyword)}".`;
        } else if (activeType !== "all") {
            message = "Tidak ada bookmark pada kategori ini.";
        }

        container.innerHTML = `
        <div class="bookmark-empty">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
        `;
        return;
    }

    // Gabungkan seluruh hasil render card yang lolos filter ke dalam kontainer
    container.innerHTML =
        bookmarks.map(
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
    
    // Gunakan properti yang tersedia secara fleksibel (item.judul atau item.title)
    const rawTitle = item.judul || item.title || "";

    return `
    <article class="bookmark-card">
        <span class="bookmark-type">
            ${CoreHelpers.escapeHtml(item.tipe || item.type)}
        </span>

        <h3>
            <a href="${url}">
                ${highlightKeyword(rawTitle)}
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

// ----------------------------------------------------------------------
// LANGKAH 7: Helper Fungsi Highlight Keyword
// ----------------------------------------------------------------------
/**
 * Memberikan penanda visual (<mark>) pada bagian teks yang cocok dengan keyword pencarian.
 * @param {string} text - Judul teks mentah asli
 * @returns {string} Teks HTML aman yang telah ditandai
 */
function highlightKeyword(text){
    const activeKeyword = typeof bookmarkKeyword !== "undefined" ? bookmarkKeyword : "";

    // Jika kata kunci pencarian kosong, kembalikan teks escapeHtml standar biasa
    if (!activeKeyword) {
        return CoreHelpers.escapeHtml(text);
    }

    // Amankan string dari serangan XSS terlebih dahulu
    const safe = CoreHelpers.escapeHtml(text);

    // Lakukan pencegahan error jika keyword mengandung regex khusus (seperti ?, ., *, dll)
    const escaped = activeKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Buat objek RegExp pencari string dengan flag global (g) dan case-insensitive (i)
    const regex = new RegExp(`(${escaped})`, "gi");

    // Bungkus bagian teks yang cocok menggunakan elemen pembungkus <mark>
    return safe.replace(regex, "<mark>$1</mark>");
}