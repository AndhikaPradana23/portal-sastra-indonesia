document.addEventListener(
    "DOMContentLoaded",
    initPage
);

async function initPage(){

    await loadLayout();

    // LANGKAH 5: Memperbarui objek konfigurasi dengan menyertakan selector #search-suggestion
    initGlobalSearch({
        input: "#search-input",
        results: "#search-results",
        autocomplete: "#autocomplete-result",
        suggestion: "#search-suggestion",
        history: "#search-history",
        popular: "#popular-search",
        status: "#search-status"
    });

    const keyword =
        getSearchKeyword();

    if(!keyword){
        return;
    }

    document
        .getElementById(
            "search-input"
        )
        .value =
        keyword;

    const data =
        await SearchService
            .globalSearch(
                keyword
            );

    renderSearchPage(
        keyword,
        data
    );

}

// =========================================================================
// CATATAN INTEGRASI:
// Fungsi di bawah ini dimasukkan ke dalam search/index.js jika fungsinya bersifat 
// lokal pada halaman pencarian, atau digunakan sebagai referensi modifikasi 
// jika fungsi aslinya berada di file global-search.js.
// =========================================================================

/**
 * LANGKAH 6: Modifikasi pada handleSearch untuk memuat data suggestion
 */
async function handleSearch(event){

    const keyword = event.target.value.trim();

    keywordAktif = keyword;

    // LANGKAH 6: Menambahkan logika pemanggilan SearchSuggestionService setelah keywordAktif ditentukan
    if(
        SearchUI.suggestion &&
        window.SearchSuggestionService
    ){
        const suggestions =
            await SearchSuggestionService
                .getSuggestions(
                    keyword
                );

        renderSuggestions(
            suggestions,
            keyword
        );
    }

    const status = SearchUI.status;
    const results = SearchUI.results;
    const autocomplete = SearchUI.autocomplete;

    if(!keyword){
        if (searchAbortController) {
            searchAbortController.abort();
        }
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        if (status) status.textContent = "Silakan ketik kata kunci.";
        if (results) results.innerHTML = "";
        if (autocomplete) autocomplete.innerHTML = "";
        // Bersihkan juga container suggestion jika input kosong
        if (SearchUI.suggestion) SearchUI.suggestion.innerHTML = "";
        return;
    }

    if (status) {
        status.innerHTML = `
            Mencari:
            <strong>${escapeHtml(keyword)}</strong>
        `;
    }

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
        if (searchAbortController) {
            searchAbortController.abort();
        }
        searchAbortController = new AbortController();
        const signal = searchAbortController.signal;

        if (results) {
            await globalSearch(keyword, signal);
        }
    }, 250);
}

/**
 * LANGKAH 8: Penambahan Event Listener klik suggestion di dalam initSearch()
 */
function initSearch(config = {}) {
    const input = SearchUI.input;
    if (!input) return;

    if (initialized) return;
    initialized = true;

    const isAutofocus = config.autofocus === true || input.dataset.autofocus === "true";
    if (isAutofocus) {
        input.focus();
    }

    input.addEventListener("input", handleSearch);
    input.addEventListener("keydown", handleKeyboardNavigation);

    if (SearchUI.history) loadSearchHistory();
    if (SearchUI.popular) loadPopularSearch();

    // LANGKAH 8: Menambahkan event listener klik delegasi untuk elemen item suggestion
    if(SearchUI.suggestion){
        SearchUI.suggestion
            .addEventListener(
                "click",
                event => {
                    const item =
                        event.target
                            .closest(
                                ".suggestion-item"
                            );

                    if(!item){
                        return;
                    }

                    const keyword =
                        item.dataset
                            .keyword;

                    input.value =
                        keyword;

                    window.location.href =
                        "/search/index.html?q=" +
                        encodeURIComponent(
                            keyword
                        );
                }
            );
    }

    // Event listener bawaan lainnya (results, autocomplete, popular, history)...
}

/**
 * LANGKAH 7: Membuat fungsi renderSuggestions di bawah fungsi renderPopularSearch()
 */
function renderPopularSearch(items){
    const container = SearchUI.popular;
    if (!container) return;

    if(!items.length){
        container.innerHTML = "<p>Belum ada.</p>";
        return;
    }

    container.innerHTML = items.map(item => `
        <button class="popular-btn" data-keyword="${escapeHtml(item.keyword)}">
            🔥 ${escapeHtml(item.keyword)}
        </button>
    `).join("");
}

// LANGKAH 7: Implementasi renderSuggestions tepat di bawah renderPopularSearch
function renderSuggestions(items, keyword){

    const container = SearchUI.suggestion;

    if(!container){
        return;
    }

    if(!items.length){
        container.innerHTML = "";
        return;
    }

    container.innerHTML =
        items
            .map(item => `
                <button
                    class="suggestion-item"
                    data-keyword="${item.trim()}"
                >
                    🔍 ${highlightKeyword(item, keyword)}
                </button>
            `)
            .join("");

}