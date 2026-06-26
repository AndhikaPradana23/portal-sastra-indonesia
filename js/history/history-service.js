// ==========================================================================
// SEARCH HISTORY SERVICE (DENGAN PROJEKSI ANTI-DUPLIKASI)
// ==========================================================================

/**
 * Mendapatkan ID User yang sedang aktif dari Supabase Auth
 * @returns {Promise<string|null>} - User ID berupa string UUID atau null
 */
async function getHistoryUserId(){
    const user =
        await getCurrentUser();

    if(!user){
        return null;
    }

    return user.id;
}

/**
 * Menyimpan riwayat kata kunci pencarian baru ke database.
 * Mencegah duplikasi jika kata kunci yang sama persis sudah pernah disimpan sebelumnya.
 * @param {string} keyword - Kata kunci yang dicari oleh pengguna
 */
async function saveSearchHistory(keyword){
    if(!keyword){
        return;
    }

    const keywordBersih = keyword.trim();

    const userId =
        await getHistoryUserId();

    if(!userId){
        return;
    }

    // ----------------------------------------------------------------------
    // BONUS: BONUS CEK DUPLIKASI KEYWORD SEBELUM INSERT
    // ----------------------------------------------------------------------
    const {
        data: duplicateData,
        error: checkError
    } = await supabaseClient
        .from(
            "search_history"
        )
        .select("id")
        .eq(
            "user_id",
            userId
        )
        .eq(
            "keyword",
            keywordBersih
        )
        .maybeSingle();

    if (checkError) {
        console.error("Gagal memeriksa duplikasi riwayat:", checkError);
    }

    // Jika keyword sudah ada di database untuk user ini, batalkan proses insert
    if(duplicateData){
        return;
    }
    // ----------------------------------------------------------------------

    // Jika lolos pengecekan (belum ada duplikat), baru lakukan insert data baru
    const { error: insertError } = await supabaseClient
        .from(
            "search_history"
        )
        .insert({
            user_id: userId,
            keyword: keywordBersih
        });

    if(insertError){
        console.error("Gagal menyimpan riwayat pencarian:", insertError);
    }
}

/**
 * Mengambil daftar riwayat pencarian milik pengguna (dibatasi maksimal 20 data terakhir).
 * @returns {Promise<Array>} - Array objek riwayat pencarian
 */
async function getSearchHistory(){
    const userId =
        await getHistoryUserId();

    if(!userId){
        return [];
    }

    const {
        data,
        error
    } =
    await supabaseClient
        .from(
            "search_history"
        )
        .select("*")
        .eq(
            "user_id",
            userId
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        )
        .limit(20);

    if(error){
        console.error("Gagal mengambil riwayat pencarian:", error);
        return [];
    }

    return data;
}

/**
 * Menghapus satu item riwayat pencarian berdasarkan ID data uniknya.
 * @param {string} id - UUID baris riwayat pencarian yang ingin dihapus
 */
async function deleteHistory(id){
    if(!id){
        return;
    }

    const { error } = await supabaseClient
        .from(
            "search_history"
        )
        .delete()
        .eq(
            "id",
            id
        );

    if(error){
        console.error("Gagal menghapus item riwayat:", error);
    }
}

/**
 * Menghapus seluruh riwayat pencarian tanpa sisa khusus untuk user yang sedang login.
 */
async function clearHistory(){
    const userId =
        await getHistoryUserId();

    if(!userId){
        return;
    }

    const { error } = await supabaseClient
        .from(
            "search_history"
        )
        .delete()
        .eq(
            "user_id",
            userId
        );

    if(error){
        console.error("Gagal mengosongkan seluruh riwayat:", error);
    }
}

// ==========================================================================
// EXPORT SERVICE KE GLOBAL SCOPE WINDOW
// ==========================================================================
window.SearchHistoryService = {
    saveSearchHistory,
    getSearchHistory,
    deleteHistory,
    clearHistory
};