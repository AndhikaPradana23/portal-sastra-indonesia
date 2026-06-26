// ==========================================================================
// BOOKMARK EXPORT UTILITIES (JSON, TXT, CSV)
// ==========================================================================

/**
 * Langkah 2: Fungsi utilitas inti untuk mengunduh data sebagai berkas (file download).
 * @param {string} content - Isi atau teks di dalam berkas
 * @param {string} filename - Nama berkas hasil unduhan (misal: bookmark.json)
 * @param {string} type - MIME type dari berkas (misal: text/plain)
 */
function downloadFile(content, filename, type) {
    const blob = new Blob(
        [content],
        { type }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    
    // Bersihkan elemen dari DOM dan memori setelah diunduh
    link.remove();
    URL.revokeObjectURL(url);
}

/**
 * Langkah 3: Mengekspor seluruh daftar data bookmark ke format berkas JSON.
 */
async function exportBookmarkJSON() {
    // Menunggu pengambilan data asinkron dari Supabase Service
    const bookmarks = await BookmarkService.getBookmarks();

    const json = JSON.stringify(
        bookmarks,
        null,
        2
    );

    downloadFile(
        json,
        "bookmark.json",
        "application/json"
    );
}

/**
 * Langkah 4: Mengekspor seluruh daftar data bookmark ke format dokumen TXT ringkas.
 */
async function exportBookmarkTXT() {
    // Menunggu pengambilan data asinkron dari Supabase Service
    const bookmarks = await BookmarkService.getBookmarks();

    const text = bookmarks.map(item => {
        const judul = item.judul || item.title || "Tanpa Judul";
        const tipe = item.tipe || item.type || "-";
        
        // Ambil URL secara dinamis via helper global jika fungsi generator tersedia
        const url = typeof getBookmarkUrl === "function" 
            ? window.location.origin + getBookmarkUrl(item) 
            : (item.url || "-");

        return `
Judul : ${judul}
Tipe  : ${tipe}
URL   : ${url}
`;
    }).join("\n-----------------\n");

    downloadFile(
        text,
        "bookmark.txt",
        "text/plain"
    );
}

/**
 * Langkah 5: Mengekspor seluruh daftar data bookmark ke format tabel lembar kerja CSV.
 */
async function exportBookmarkCSV() {
    // Menunggu pengambilan data asinkron dari Supabase Service
    const bookmarks = await BookmarkService.getBookmarks();

    // Tentukan struktur kolom kepala tabel (Header Rows)
    const rows = [
        [
            "title",
            "type",
            "url",
            "created_at"
        ]
    ];

    // Susun baris data isi dari setiap item bookmark
    bookmarks.forEach(item => {
        const judul = item.judul || item.title || "";
        const tipe = item.tipe || item.type || "";
        
        // Ambil URL secara dinamis via helper global jika fungsi generator tersedia
        const url = typeof getBookmarkUrl === "function" 
            ? window.location.origin + getBookmarkUrl(item) 
            : (item.url || "");

        rows.push([
            judul,
            tipe,
            url,
            item.created_at || ""
        ]);
    });

    // Bungkus setiap nilai dengan tanda kutip ganda dan satukan dengan koma/baris baru
    const csv = rows
        .map(row =>
            row
                .map(value =>
                    `"${String(value ?? "").replace(/"/g, '""')}"`
                )
                .join(",")
        )
        .join("\n");

    downloadFile(
        csv,
        "bookmark.csv",
        "text/csv"
    );
}

// ==========================================================================
// Langkah 6: EXPOSE GLOBAL MODULE FUNCTION
// ==========================================================================
window.BookmarkExport = {
    exportBookmarkJSON,
    exportBookmarkTXT,
    exportBookmarkCSV
};