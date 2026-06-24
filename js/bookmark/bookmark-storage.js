// =====================================
// BOOKMARK STORAGE
// =====================================

const BOOKMARK_TABLE = "bookmark";

/**
 * Menambahkan bookmark baru ke database Supabase.
 * Dilengkapi dengan pengecekan duplikasi sebelum proses insert dilakukan.
 * @param {Object} item - Objek bookmark yang berisi properti 'tipe', 'slug', dan 'judul'
 * @returns {Promise<Object>} - Mengembalikan objek { data, error } dari Supabase
 */
async function insertBookmark(item){
    // Cek terlebih dahulu apakah item dengan slug dan tipe tersebut sudah ada
    const existing = await findBookmark(
        item.slug,
        item.tipe
    );

    // Jika data sudah terdaftar, langsung kembalikan data yang ada tanpa melakukan insert ulang
    if(existing.data){
        return {
            data: existing.data,
            error: null
        };
    }

    // Jika belum ada, lakukan proses insert baru
    return await supabaseClient
        .from(BOOKMARK_TABLE)
        .insert(item);
}

/**
 * Menghapus data bookmark berdasarkan kombinasi slug dan tipenya.
 * @param {string} slug - Teks slug unik dari konten
 * @param {string} tipe - Jenis kategori konten (artikel, sastrawan, karya, atau istilah)
 * @returns {Promise<Object>} - Mengembalikan objek status dari Supabase
 */
async function deleteBookmark(slug, tipe){
    return await supabaseClient
        .from(BOOKMARK_TABLE)
        .delete()
        .eq("slug", slug)
        .eq("tipe", tipe);
}

/**
 * Mencari satu data bookmark spesifik berdasarkan kombinasi slug dan tipenya.
 * Menggunakan .maybeSingle() agar mengembalikan objek jika ditemukan, atau null jika tidak ada (tanpa memicu error).
 * @param {string} slug - Teks slug unik dari konten
 * @param {string} tipe - Jenis kategori konten
 * @returns {Promise<Object>} - Mengembalikan objek { data, error } dari Supabase
 */
async function findBookmark(slug, tipe){
    return await supabaseClient
        .from(BOOKMARK_TABLE)
        .select("*")
        .eq("slug", slug)
        .eq("tipe", tipe)
        .maybeSingle();
}

/**
 * Mengambil semua daftar data bookmark yang tersimpan di database.
 * Diurutkan berdasarkan waktu pembuatan terbaru (descending).
 * @returns {Promise<Object>} - Mengembalikan objek { data, error } berisi array dari Supabase
 */
async function fetchBookmarks(){
    return await supabaseClient
        .from(BOOKMARK_TABLE)
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );
}