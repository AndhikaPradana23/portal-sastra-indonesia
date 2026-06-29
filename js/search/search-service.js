// ==========================================================================
// SEARCH TABLE SERVICE (CORE)
// ==========================================================================
async function searchTable(
    tableName,
    field,
    keyword,
    limit = 5
){

    const {
        data,
        error
    } =
    await supabaseClient
        .from(tableName)
        .select(`
            id,
            slug,
            ${field}
        `)
        .ilike(
            field,
            `%${keyword}%`
        )
        .limit(limit);

    if(error){
        console.error(error);
        return [];
    }

    return data || [];

}

// ==========================================================================
// SPECIFIC SEARCH FUNCTIONS
// ==========================================================================
async function cariIstilah(keyword) {
    return searchTable("istilah", "nama", keyword);
}

async function cariArtikel(keyword) {
    return searchTable("artikel", "judul", keyword);
}

async function cariKarya(keyword) {
    return searchTable("karya", "judul", keyword);
}

async function cariSastrawan(keyword) {
    return searchTable("sastrawan", "nama", keyword);
}

// ==========================================================================
// GLOBAL SEARCH SERVICE (MULTI-TABLE PENCARIAN)
// ==========================================================================
async function globalSearch(
    keyword
){

    const [
        istilah,
        artikel,
        karya,
        sastrawan
    ] =
    await Promise.all([

        cariIstilah(
            keyword
        ),

        cariArtikel(
            keyword
        ),

        cariKarya(
            keyword
        ),

        cariSastrawan(
            keyword
        )

    ]);

    return {
        istilah,
        artikel,
        karya,
        sastrawan
    };

}

// ==========================================================================
// EXPORT GLOBAL OBJECT
// ==========================================================================
window.SearchService = {
    globalSearch
};