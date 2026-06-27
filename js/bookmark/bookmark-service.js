// ==========================================================================
// BOOKMARK SERVICE (CORE DATABASE QUERIES)
// ==========================================================================

/**
 * Mendapatkan ID User yang sedang aktif dari Supabase Auth
 * @returns {Promise<string|null>} - User ID berupa string UUID atau null
 */
async function getBookmarkUser(){
    const user = await getCurrentUser();

    if(!user){
        return null;
    }

    return user.id;
}

/**
 * Menambahkan item ke dalam daftar bookmark database.
 * @param {string} tipe - Kategori tipe dari konten (e.g., 'artikel', 'sastrawan')
 * @param {string} itemId - ID UUID konten asal
 * @returns {Promise<boolean>} - Mengembalikan true jika sukses, false jika gagal
 */
async function addBookmark(tipe, itemId){
    
    // ==================================================
    // VALIDASI PARAMETER AWAL
    // ==================================================
    if(!tipe || !itemId){
        console.error("Parameter bookmark tidak valid", { tipe, itemId });
        return false;
    }

    const userId = await getBookmarkUser();

    if(!userId){
        return false;
    }

    const { error } = await supabaseClient
        .from("bookmark_user")
        .insert({
            user_id: userId,
            tipe,
            item_id: itemId
        });

    if(error){
        console.error("Gagal menambahkan bookmark:", error);
        return false;
    }

    return true;
}

/**
 * Menghapus item dari daftar bookmark berdasarkan tipe dan itemId.
 * @param {string} tipe - Kategori tipe dari konten
 * @param {string} itemId - ID UUID konten asal
 * @returns {Promise<boolean>} - True jika berhasil dihapus, false jika gagal
 */
async function removeBookmark(tipe, itemId){
    
    // ==================================================
    // VALIDASI PARAMETER AWAL
    // ==================================================
    if(!tipe || !itemId){
        return false;
    }

    const userId = await getBookmarkUser();

    if(!userId){
        return false;
    }

    const { error } = await supabaseClient
        .from("bookmark_user")
        .delete()
        .eq("user_id", userId)
        .eq("tipe", tipe)
        .eq("item_id", itemId);

    if(error){
        console.error("Gagal menghapus bookmark:", error);
        return false;
    }

    return true;
}

/**
 * Memeriksa apakah suatu konten sudah disimpan ke dalam bookmark.
 * @param {string} tipe - Kategori tipe dari konten
 * @param {string} itemId - ID UUID konten asal
 * @returns {Promise<boolean>} - True jika sudah ada di bookmark, false jika belum
 */
async function isBookmarked(tipe, itemId){
    
    // ==================================================
    // VALIDASI PARAMETER AWAL
    // ==================================================
    if(!tipe || !itemId){
        return false;
    }

    const userId = await getBookmarkUser();

    if(!userId){
        return false;
    }

    const { data } = await supabaseClient
        .from("bookmark_user")
        .select("id")
        .eq("user_id", userId)
        .eq("tipe", tipe)
        .eq("item_id", itemId)
        .maybeSingle();

    return !!data;
}

/**
 * SOLUSI 3: Menambahkan Metadata Relasi (Enrichment) Secara Dinamis + FITUR DEBUG
 * Mengambil detail slug dan judul/nama dari tabel relasi asal konten.
 * @param {Object} item - Objek data dasar mentah dari tabel bookmark_user
 * @returns {Promise<Object>} - Objek bookmark yang sudah ditambahkan properti slug dan judul terbaru
 */
async function enrichBookmark(item){

    let table;
    let titleField;

    switch(item.tipe){

        case "istilah":
            table = "istilah";
            titleField = "nama";
            break;

        case "artikel":
            table = "artikel";
            titleField = "judul";
            break;

        case "sastrawan":
            table = "sastrawan";
            titleField = "nama";
            break;

        case "karya":
            table = "karya";
            titleField = "judul";
            break;

        default:
            return item;
    }

    const {
        data,
        error
    } =
    await supabaseClient
        .from(table)
        .select(`
            id,
            slug,
            ${titleField}
        `)
        .eq(
            "id",
            item.item_id
        )
        .single();

    if(error){

        console.error(
            "Enrich bookmark error:",
            error
        );

        return item;
    }

    return {

        ...item,

        slug:
            data.slug,

        judul:
            data[titleField]

    };

}

/**
 * SOLUSI 3: Mengambil seluruh daftar bookmark yang tersimpan milik user aktif.
 * Data diurutkan berdasarkan yang terbaru (descending) dan diperkaya menggunakan enrichBookmark.
 * @returns {Promise<Array>} - Array berisi objek-objek bookmark lengkap dengan slug dan judul
 */
async function getBookmarks(){

    const userId = await getBookmarkUser();

    if(!userId){
        return [];
    }

    const { data, error } = await supabaseClient
        .from("bookmark_user")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if(error){
        console.error(error);
        return [];
    }

    const result = await Promise.all(
        data.map(enrichBookmark)
    );

    return result;
}

// ==========================================================================
// HELPER FUNCTIONS & UTILITIES
// ==========================================================================

/**
 * LANGKAH 4: Toggle Bookmark Baru
 * Mengubah status simpan/lepas bookmark berdasarkan parameter tipe dan itemId konten.
 * Mendukung passing parameter berupa string langsung maupun objek terbungkus.
 * @param {string|Object} tipeOrObj - Kategori tipe konten atau objek utuh hasil createBookmarkItem
 * @param {string} [itemId] - UUID dari konten asal (opsional jika argumen pertama berupa objek)
 * @returns {Promise<boolean>} - True jika status akhir disimpan, False jika dilepas
 */
async function toggleBookmark(tipeOrObj, itemId){
    
    let tipe = tipeOrObj;
    let actualItemId = itemId;

    // Jika yang di-pass adalah objek utuh dari createBookmarkItem
    if(tipeOrObj && typeof tipeOrObj === "object"){
        tipe = tipeOrObj.tipe;
        actualItemId = tipeOrObj.item_id || tipeOrObj.itemId;
    }

    const saved = await isBookmarked(tipe, actualItemId);

    if(saved){
        await removeBookmark(tipe, actualItemId);
        return false;
    }

    await addBookmark(tipe, actualItemId);
    return true;
}

/**
 * SOLUSI 2: Fungsi pabrikator untuk membuat struktur data objek bookmark seragam di frontend.
 * Menambahkan properti slug ke dalam return value pabrikasi objek.
 * @param {Object} param0 - Properti utama objek termasuk slug
 * @returns {Object}
 */
function createBookmarkItem({ tipe, item_id, judul, slug }){
    return {
        tipe,
        item_id,
        judul,
        slug
    };
}

/**
 * Menghitung total akumulasi jumlah seluruh data bookmark user.
 * @returns {Promise<number>} - Jumlah total item yang di-bookmark
 */
async function getBookmarkCount(){
    const list = await getBookmarks();
    return list.length;
}

/**
 * Menghitung jumlah data bookmark berdasarkan tipenya masing-masing secara spesifik.
 * @returns {Promise<Object>} - Objek berisi jumlah tiap kategori tipe
 */
async function getBookmarkCountByType(){
    const bookmarks = await getBookmarks();

    return {
        istilah: bookmarks.filter(
            item => (item.tipe || item.type) === "istilah"
        ).length,

        artikel: bookmarks.filter(
            item => (item.tipe || item.type) === "artikel"
        ).length,

        sastrawan: bookmarks.filter(
            item => (item.tipe || item.type) === "sastrawan"
        ).length,

        karya: bookmarks.filter(
            item => (item.tipe || item.type) === "karya"
        ).length
    };
}

// ==========================================================================
// URL GENERATOR
// ==========================================================================

/**
 * SOLUSI 4: Membuat URL secara dinamis menggunakan parameter slug, bukan item_id lagi.
 * @param {Object} item - Objek bookmark yang memiliki properti slug
 * @returns {string} - Teks URL lengkap menuju halaman detail berbasis slug
 */
function getBookmarkUrl(item){

    switch(item.tipe){
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

// ==========================================================================
// EXPORT SERVICE KE GLOBAL SCOPE
// ==========================================================================
window.BookmarkService = {
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarks,
    toggleBookmark,
    createBookmarkItem,
    getBookmarkCount,
    getBookmarkCountByType,
    getBookmarkUrl
};