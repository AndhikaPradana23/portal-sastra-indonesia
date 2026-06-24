// ==========================================
// INCOUPLED INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    // Memuat layout utama terlebih dahulu
    await loadLayout();

    // Inisialisasi pemetaan elemen HTML spesifik untuk halaman Search
    initGlobalSearch({
        input: "#global-search",
        results: "#search-results",
        autocomplete: "#autocomplete-list",
        history: "#search-history",
        popular: "#popular-search",
        status: "#search-status"
    });

    // Jalankan setup event listener dan memuat data awal komponen
    initSearch();

});