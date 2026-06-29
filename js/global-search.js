// ==========================================================================
// PORTAL SASTRA INDONESIA - GLOBAL SEARCH COMPONENT
// ==========================================================================

// ==========================================
// OBJECT KONFIGURASI UI (DECOUPLED & SEALED)
// ==========================================
const SearchUI = {
    input: null,
    results: null,
    autocomplete: null,
    suggestion: null, // Tempat merender hasil getSuggestions()
    history: null,
    popular: null,
    status: null
};

// Memproteksi objek konfigurasi agar tidak dimutasi sembarangan
Object.seal(SearchUI);

// ==========================================
// VARIABEL GLOBAL DATA & STATE MANAGEMENT
// ==========================================
let keywordAktif = "";
let autocompleteItems = [];
let selectedAutocomplete = -1;
let initialized = false; // Flag pelindung dobel init
let debounceTimer = null; // Timer untuk Debounce pencarian
let searchAbortController = null; // Controller pembatalan request lama

// Fungsi inisialisasi komponen dari luar (Halaman/Navbar)
function initGlobalSearch(config) {
    SearchUI.input = config.input ? document.querySelector(config.input) : null;
    SearchUI.results = config.results ? document.querySelector(config.results) : null;
    SearchUI.autocomplete = config.autocomplete ? document.querySelector(config.autocomplete) : null;
    SearchUI.suggestion = config.suggestion ? document.querySelector(config.suggestion) : null;
    SearchUI.history = config.history ? document.querySelector(config.history) : null;
    SearchUI.popular = config.popular ? document.querySelector(config.popular) : null;
    SearchUI.status = config.status ? document.querySelector(config.status) : null;

    // Warning untuk seluruh elemen pendukung demi kemudahan debugging
    if (config.input && !SearchUI.input) console.warn("Input Search tidak ditemukan untuk selector: " + config.input);
    if (config.results && !SearchUI.results) console.warn("Container Results tidak ditemukan untuk selector: " + config.results);
    if (config.autocomplete && !SearchUI.autocomplete) console.warn("Container Autocomplete tidak ditemukan untuk selector: " + config.autocomplete);
    if (config.suggestion && !SearchUI.suggestion) console.warn("Container Suggestion tidak ditemukan untuk selector: " + config.suggestion);
    if (config.history && !SearchUI.history) console.warn("Container History tidak ditemukan untuk selector: " + config.history);
    if (config.popular && !SearchUI.popular) console.warn("Container Popular tidak ditemukan untuk selector: " + config.popular);
    if (config.status && !SearchUI.status) console.warn("Container Status tidak ditemukan untuk selector: " + config.status);

    // Panggil mesin autocomplete eksternal jika container disediakan
    if (config.input && config.autocomplete) {
        console.log("initAutocomplete:", window.initAutocomplete);
        if (typeof window.initAutocomplete === "function") {
            window.initAutocomplete({
                input: config.input,
                result: config.autocomplete
            });
        }
    }

    // Jalankan setup internal komponen setelah konfigurasi diisi
    initSearch(config);
}

// ==========================================
// INIT SETUP INTERNAL COMPONENT
// ==========================================
function initSearch(config = {}) {
    const input = SearchUI.input;
    if (!input) return; // Proteksi jika elemen input tidak ditemukan di halaman aktif

    // Mencegah duplikasi Event Listener jika fungsi dipanggil berulang kali
    if (initialized) return;
    initialized = true;

    // Fleksibilitas Autofocus (bisa lewat config object ataupun data-attribute pada HTML)
    const isAutofocus = config.autofocus === true || input.dataset.autofocus === "true";
    if (isAutofocus) {
        input.focus();
    }

    input.addEventListener("input", handleSearch);
    input.addEventListener("keydown", handleKeyboardNavigation);

    // Memuat riwayat secara opsional jika kontainernya disediakan
    if (SearchUI.history) {
        loadSearchHistory();
    }

    // Memuat pencarian populer secara opsional jika kontainernya disediakan
    if (SearchUI.popular) {
        loadPopularSearch();
    }

    // Event Delegation lokal pada Container UI masing-masing
    if (SearchUI.results) {
        SearchUI.results.addEventListener("click", async event => {
            const card = event.target.closest(".search-card");
            if (card) {
                await saveSearchHistory(card.dataset.keyword);
            }
        });
    }

    if (SearchUI.autocomplete) {
        SearchUI.autocomplete.addEventListener("click", async event => {
            const item = event.target.closest(".autocomplete-item");
            if (item) {
                await saveSearchHistory(item.dataset.keyword);
            }
        });

        // Hover mouse memperbarui indeks navigasi keyboard secara sinkron di dalam area autocomplete
        SearchUI.autocomplete.addEventListener("mouseover", event => {
            const item = event.target.closest(".autocomplete-item");
            if (!item) return;

            selectedAutocomplete = Number(item.dataset.index);
            updateAutocompleteSelection();
        });
    }

    // Integrasi Klik pada kontainer Suggestion/Saran kata kunci murni
    if (SearchUI.suggestion) {
        SearchUI.suggestion.addEventListener("click", event => {
            const btn = event.target.closest(".suggestion-btn");
            if (btn) {
                const keyword = btn.dataset.keyword;
                if (input) {
                    input.value = keyword;
                    keywordAktif = keyword;
                    handleSearch({ target: input });
                }
            }
        });
    }

    if (SearchUI.popular) {
        SearchUI.popular.addEventListener("click", event => {
            if (event.target.classList.contains("popular-btn")) {
                const keyword = event.target.dataset.keyword;
                if (input) {
                    input.value = keyword;
                    keywordAktif = keyword;
                    handleSearch({ target: input });
                }
            }
        });
    }

    if (SearchUI.history) {
        SearchUI.history.addEventListener("click", async event => {
            if (event.target.classList.contains("history-btn")) {
                const keyword = event.target.dataset.keyword;
                if (input) {
                    input.value = keyword;
                    keywordAktif = keyword;
                    handleSearch({ target: input });
                }
            }

            // Hapus item satuan berdasarkan ID database jika ada tombol delete
            if (event.target.classList.contains("delete-history-btn")) {
                event.stopPropagation();
                const historyId = event.target.dataset.id;
                if (window.SearchHistoryService) {
                    await window.SearchHistoryService.deleteHistory(historyId);
                    await loadSearchHistory();
                }
            }

            // Bersihkan seluruh riwayat pencarian
            if (event.target.id === "clear-history") {
                const session = typeof getSession === "function" ? await getSession() : null;

                if (session && window.SearchHistoryService) {
                    await SearchHistoryService.clearHistory();
                } else {
                    localStorage.removeItem("guest_search_history");
                }

                await loadSearchHistory();
            }
        });
    }
}

// ==========================================
// EVENT SEARCH (WITH DEBOUNCE & ABORT CONTROLLER)
// ==========================================
async function handleSearch(event) {
    const keyword = event.target.value.trim();

    // Menyimpan kata kunci ke variabel global
    keywordAktif = keyword;

    const status = SearchUI.status;
    const results = SearchUI.results;
    const autocomplete = SearchUI.autocomplete;
    const suggestion = SearchUI.suggestion;

    // Bersihkan container & batalkan request berjalan jika input kosong
    if (!keyword) {
        if (searchAbortController) {
            searchAbortController.abort();
        }
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        if (status) status.textContent = "Silakan ketik kata kunci.";
        if (results) results.innerHTML = "";
        if (autocomplete) autocomplete.innerHTML = "";
        if (suggestion) suggestion.innerHTML = "";
        return;
    }

    if (status) {
        status.innerHTML = `
            Mencari:
            <strong>${escapeHtml(keyword)}</strong>
        `;
    }

    // Menghindari overload request server dengan mekanisme Debounce (delay 250ms)
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
        // Batalkan request HTTP lama yang masih menggantung (Stale Request)
        if (searchAbortController) {
            searchAbortController.abort();
        }
        // Buat instansiasi AbortController baru untuk request saat ini
        searchAbortController = new AbortController();
        const signal = searchAbortController.signal;

        // Panggil global search utama menggunakan SearchAPI modern
        if (results || suggestion) {
            await globalSearch(keyword, signal);
        }
    }, 250);
}

// ==========================================
// GLOBAL SEARCH INTEGRATION WITH SearchAPI
// ==========================================
async function globalSearch(keyword, signal) {
    const results = SearchUI.results;
    const suggestionContainer = SearchUI.suggestion;

    if (results) results.innerHTML = "<p>Memuat...</p>";
    if (suggestionContainer) suggestionContainer.innerHTML = "<p>Memuat saran...</p>";

    try {
        // Integrasi Langkah 1 & Langkah 4: Memanfaatkan SearchAPI terpusat secara paralel
        const [searchData, suggestions] = await Promise.all([
            window.SearchAPI ? window.SearchAPI.search(keyword) : { istilah: [], artikel: [], karya: [], sastrawan: [] },
            window.SearchAPI ? window.SearchAPI.getSuggestions(keyword) : []
        ]);

        // Pastikan tidak merender data jika request ini sudah dibatalkan di tengah jalan
        if (signal && signal.aborted) return;

        // Render data hasil pencarian terstruktur ke grid komponen
        if (results) {
            renderSemuaHasil(searchData);
        }

        // Render array kata kunci murni ke container suggestion jika tersedia
        if (suggestionContainer) {
            renderSuggestionsUI(suggestions);
        }

    } catch (error) {
        // Jangan tampilkan pesan error ke user jika kegagalan murni karena Abort-Signal dilakukan sengaja
        if (error.name === 'AbortError' || (error.message && error.message.includes('abort'))) {
            return;
        }
        console.error(error);
        if (results) results.innerHTML = "<p>Terjadi kesalahan.</p>";
        if (suggestionContainer) suggestionContainer.innerHTML = "";
    }
}

// ==========================================
// NAVIGASI KEYBOARD FUNCTIONS 
// ==========================================
async function handleKeyboardNavigation(event) {
    const input = SearchUI.input;
    if (!input) return;

    // Deteksi Tombol Enter saat fokus di kolom input biasa tanpa memilih autocomplete
    if (event.key === "Enter" && selectedAutocomplete === -1) {
        const keyword = input.value.trim();
        if (!keyword) return;

        event.preventDefault();
        await saveSearchHistory(keyword);

        window.location.href = "/search/index.html?q=" + encodeURIComponent(keyword);
        return;
    }

    if (autocompleteItems.length === 0) {
        return;
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedAutocomplete++;
        if (selectedAutocomplete >= autocompleteItems.length) {
            selectedAutocomplete = 0;
        }
        updateAutocompleteSelection();
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedAutocomplete--;
        if (selectedAutocomplete < 0) {
            selectedAutocomplete = autocompleteItems.length - 1;
        }
        updateAutocompleteSelection();
    } else if (event.key === "Enter") {
        if (selectedAutocomplete >= 0) {
            event.preventDefault();
            await saveSearchHistory(autocompleteItems[selectedAutocomplete].label);
            window.location.href = autocompleteItems[selectedAutocomplete].url;
        }
    } else if (event.key === "Escape") {
        const container = SearchUI.autocomplete;
        if (container) container.innerHTML = "";
    }
}

// Fungsi sinkronisasi status kelas visual pilihan aktif
function updateAutocompleteSelection() {
    if (!SearchUI.autocomplete) return;

    const items = SearchUI.autocomplete.querySelectorAll(".autocomplete-item");

    items.forEach(item => item.classList.remove("selected"));

    if (selectedAutocomplete >= 0 && items[selectedAutocomplete]) {
        items[selectedAutocomplete].classList.add("selected");
        items[selectedAutocomplete].scrollIntoView({
            block: "nearest"
        });
    }
}

// ==========================================
// MANAGEMENT RIWAYAT PENCARIAN
// ==========================================
async function saveSearchHistory(keyword) {
    const cleanKeyword = keyword?.trim();
    if (!cleanKeyword) return;

    if (window.SearchHistorySync) {
        await SearchHistorySync.save(cleanKeyword);
    }

    if (SearchUI.history) {
        await loadSearchHistory();
    }
}

async function loadSearchHistory() {
    const container = SearchUI.history;
    if (!container) return;

    let history = [];
    const session = typeof getSession === "function" ? await getSession() : null;

    // USER LOGIN
    if (session && window.SearchHistoryService) {
        history = await SearchHistoryService.getSearchHistory();
    } 
    // GUEST
    else {
        history = JSON.parse(localStorage.getItem("guest_search_history")) || [];
        history = history.map(keyword => ({ keyword }));
    }

    if (history.length === 0) {
        container.innerHTML = `<p>Belum ada riwayat.</p>`;
        return;
    }

    container.innerHTML = history
        .map(item => `
            <button class="history-btn" data-keyword="${escapeHtml(item.keyword)}">
                🕒 ${escapeHtml(item.keyword)}
            </button>
        `)
        .join("");
}

async function syncGuestHistory() {
    const history = JSON.parse(localStorage.getItem("guest_search_history")) || [];
    if (!history.length) return;

    if (window.SearchHistoryService) {
        for (const keyword of history) {
            await SearchHistoryService.saveSearchHistory(keyword);
        }
        localStorage.removeItem("guest_search_history");
    }
}

// ==========================================
// MANAGEMENT PENCARIAN POPULER (POPULAR CONTENT)
// ==========================================
async function loadPopularSearch() {
    const container = SearchUI.popular;
    if (!container) return;

    container.innerHTML = "Memuat...";

    try {
        const items = window.PopularSearchService ? await PopularSearchService.getPopularSearches() : [];
        renderPopularSearch(items);
    } catch (error) {
        console.error(error);
        container.innerHTML = "Gagal memuat.";
    }
}

function renderPopularSearch(items) {
    const container = SearchUI.popular;
    if (!container) return;

    if (!items.length) {
        container.innerHTML = `<p>Belum ada pencarian.</p>`;
        return;
    }

    container.innerHTML = items
        .map((item, index) => `
            <button class="popular-btn" data-keyword="${escapeHtml(item.keyword)}">
                #${index + 1} 🔥 ${escapeHtml(item.keyword)}
                ${item.total ? `<small>(${item.total})</small>` : ''}
            </button>
        `)
        .join("");
}

// ==========================================
// UI RENDERERS (RESULTS & SUGGESTIONS)
// ==========================================
function renderSemuaHasil(data) {
    const container = SearchUI.results;
    if (!container) return;

    container.innerHTML =
        renderSection("Istilah", data.istilah, "nama", "/kamus-istilah/detail.html?slug=") +
        renderSection("Sastrawan", data.sastrawan, "nama", "/sastrawan/detail.html?slug=") +
        renderSection("Karya Sastra", data.karya, "judul", "/karya-sastra/detail.html?slug=") +
        renderSection("Artikel", data.artikel, "judul", "/artikel/detail.html?slug=");
}

function renderSection(title, items, field, url) {
    if (!items || !items.length) return "";

    const ranked = rankResults(items, field);

    return `
        <section class="search-section-result">
            <h2>${title}</h2>
            <div class="search-grid">
                ${ranked.map(item => renderCard(item, field, url)).join("")}
            </div>
        </section>
    `;
}

function renderCard(item, field, url) {
    return `
        <a class="search-card" href="${url}${item.slug}" data-keyword="${escapeHtml(item[field])}">
            <h3>
                ${typeof highlightKeyword === "function" ? highlightKeyword(item[field], keywordAktif) : item[field]}
            </h3>
        </a>
    `;
}

// Renderer Tambahan khusus untuk komponen getSuggestions() Array murni
function renderSuggestionsUI(suggestions) {
    const container = SearchUI.suggestion;
    if (!container) return;

    if (!suggestions || !suggestions.length) {
        container.innerHTML = `<p class="no-suggest">Tidak ada saran kata kunci.</p>`;
        return;
    }

    // Mengambil maksimal 5 item unik untuk disuguhkan ke pengguna
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);

    container.innerHTML = `
        <div class="suggestion-wrapper">
            <span class="suggestion-title">Saran pencarian:</span>
            ${uniqueSuggestions.map(word => `
                <button class="suggestion-btn" data-keyword="${escapeHtml(word)}">
                    🔍 ${escapeHtml(word)}
                </button>
            `).join("")}
        </div>
    `;
}

// ==========================================
// HELPERS / RANKING / ESCAPER
// ==========================================
function rankResults(items, field) {
    const keyword = keywordAktif.toLowerCase().trim();

    return items
        .map(item => {
            const text = (item[field] || "").toLowerCase();
            let score = 0;

            if (text === keyword) score += 1000;
            else if (text.startsWith(keyword)) score += 700;
            else if (text.includes(keyword)) score += 400;

            score += Math.min(item.views || 0, 300);

            return { ...item, score };
        })
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a[field].localeCompare(b[field], "id");
        });
}

// Fungsi pengaman XSS Injection sederhana untuk manipulasi DOM string
function escapeHtml(string) {
    if (!string) return "";
    return String(string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Export Global
window.initGlobalSearch = initGlobalSearch;
window.syncGuestHistory = syncGuestHistory;