// ==========================================================================
// PORTAL SASTRA INDONESIA - SEARCH WEB API WRAPPER
// ==========================================================================

const SearchAPI = {
    // LANGKAH 5: Definisi standard endpoint style untuk fleksibilitas migrasi backend
    endpoint: "/api/search",

    /**
     * LANGKAH 1: Core Search Method (Global Search)
     * Mengambil seluruh data terkait dari SearchService
     */
    async search(keyword) {
        if (!keyword || !keyword.trim()) {
            return {
                istilah: [],
                artikel: [],
                karya: [],
                sastrawan: []
            };
        }

        return await SearchService.globalSearch(keyword.trim());
    },

    /**
     * LANGKAH 2: Search By Specific Type
     * Memfilter hasil pencarian hanya untuk tipe entitas tertentu
     */
    async searchByType(keyword, type) {
        const result = await this.search(keyword);
        return result[type] || [];
    },

    /**
     * LANGKAH 3: Search Count API
     * Menghitung jumlah item per kategori beserta total keseluruhannya
     */
    async searchCount(keyword) {
        const result = await this.search(keyword);

        return {
            istilah: result.istilah.length,
            artikel: result.artikel.length,
            karya: result.karya.length,
            sastrawan: result.sastrawan.length,
            total:
                result.istilah.length +
                result.artikel.length +
                result.karya.length +
                result.sastrawan.length
        };
    },

    /**
     * LANGKAH 4: Search Suggestion API
     * Meratakan (flatten) properti penamaan objek menjadi array string murni
     */
    async getSuggestions(keyword) {
        const result = await this.search(keyword);

        return [
            ...result.istilah.map(item => item.nama),
            ...result.sastrawan.map(item => item.nama),
            ...result.karya.map(item => item.judul),
            ...result.artikel.map(item => item.judul)
        ];
    }
};

// EXPORT TO WINDOW OBJECT
window.SearchAPI = SearchAPI;