// ==========================================================================
// BOOKMARK SERVICE
// ==========================================================================

/**
 * Menambahkan item ke dalam daftar bookmark database.
 * @param {Object} item - Objek bookmark hasil dari createBookmarkItem
 * @returns {Promise<boolean>} - Mengembalikan true jika sukses, false jika gagal
 */
async function addBookmark(item){
    const {
        error
    } = await insertBookmark(item);

    if(error){
        console.error(error);
        return false;
    }

    return true;
}

/**
 * Menghapus item dari daftar bookmark berdasarkan slug dan tipenya.
 * @param {string} slug - Slug unik dari item sastra/artikel yang dihapus
 * @param {string} tipe - Kategori tipe dari item
 */
async function removeBookmark(slug, tipe){
    const {
        error
    } = await deleteBookmark(slug, tipe);

    if(error){
        console.error(error);
    }
}

/**
 * Memeriksa apakah suatu konten sudah disimpan ke dalam bookmark atau belum berdasarkan slug dan tipe.
 * @param {string} slug - Slug dari konten yang diperiksa
 * @param {string} tipe - Kategori tipe dari konten
 * @returns {Promise<boolean>} - True jika sudah ada di bookmark, false jika belum
 */
async function isBookmarked(slug, tipe){
    const {
        data
    } = await findBookmark(slug, tipe);

    return !!data;
}

/**
 * Mengambil seluruh daftar bookmark yang tersimpan di database.
 * @returns {Promise<Array>} - Array berisi objek-objek bookmark, atau array kosong jika gagal
 */
async function getBookmarks(){
    const {
        data,
        error
    } = await fetchBookmarks();

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

// ==========================================================================
// HELPER FUNCTIONS (LANGKAH 3, 4, & 5)
// ==========================================================================

/**
 * LANGKAH 3: Fungsi otomatis pasang/lepas bookmark (digunakan pada tombol bookmark).
 * Jika sudah ada maka dihapus, jika belum ada maka ditambahkan.
 * @param {Object} item - Objek bookmark lengkap
 * @returns {Promise<boolean>} - Menghasilkan true jika status akhir di-bookmark, false jika dilepas
 */
async function toggleBookmark(item){
    const bookmarked =
        await isBookmarked(
            item.slug,
            item.tipe
        );

    if(bookmarked){
        await removeBookmark(
            item.slug,
            item.tipe
        );
        return false;
    }

    await addBookmark(item);
    return true;
}

/**
 * LANGKAH 4: Fungsi pabrikator untuk membuat struktur data objek bookmark seragam.
 * (Diperbarui: Menghapus properti url agar database fleksibel dan scalable)
 * @param {Object} param0 - Properti tipe, slug, dan judul konten
 * @returns {Object} - Objek standar data bookmark tanpa url
 */
function createBookmarkItem({
    tipe,
    slug,
    judul
}){
    return {
        tipe,
        slug,
        judul
    };
}

/**
 * LANGKAH 5: Menghitung total akumulasi jumlah data bookmark yang tersimpan.
 * Biasanya digunakan untuk menampilkan lencana angka jumlah di halaman beranda.
 * @returns {Promise<number>} - Jumlah total item yang di-bookmark
 */
async function getBookmarkCount(){
    const list =
        await getBookmarks();

    return list.length;
}

// ==========================================================================
// URL GENERATOR
// ==========================================================================

/**
 * Membuat URL secara dinamis dari tipe dan slug.
 * Mencegah kerusakan link bookmark jika struktur folder website berubah di masa depan.
 * @param {Object} item - Objek bookmark yang berisi properti 'tipe' dan 'slug'
 * @returns {string} - Teks URL lengkap halaman detail
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