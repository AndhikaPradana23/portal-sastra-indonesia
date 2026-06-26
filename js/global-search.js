// ==========================================
// OBJECT KONFIGURASI UI (DECOUPLED & SEALED)
// ==========================================
const SearchUI = {
    input: null,
    results: null,
    autocomplete: null,
    history: null,
    popular: null,
    status: null
};

// Penyempurnaan Poin 4: Memproteksi objek konfigurasi agar tidak dimutasi sembarangan
Object.seal(SearchUI);

// ==========================================
// VARIABEL GLOBAL DATA & STATE MANAGEMENT
// ==========================================
let keywordAktif = "";
let autocompleteItems = [];
let selectedAutocomplete = -1;
let initialized = false; // Penyempurnaan Poin 1: Flag pelindung dobel init
let debounceTimer = null; // Penyempurnaan Poin 5: Timer untuk Debounce pencarian
let searchAbortController = null; // Penyempurnaan Poin 6: Controller pembatalan request lama

// Fungsi inisialisasi komponen dari luar (Halaman/Navbar)
function initGlobalSearch(config){
    SearchUI.input = config.input ? document.querySelector(config.input) : null;
    SearchUI.results = config.results ? document.querySelector(config.results) : null;
    SearchUI.autocomplete = config.autocomplete ? document.querySelector(config.autocomplete) : null;
    SearchUI.history = config.history ? document.querySelector(config.history) : null;
    SearchUI.popular = config.popular ? document.querySelector(config.popular) : null;
    SearchUI.status = config.status ? document.querySelector(config.status) : null;

    // Penyempurnaan Poin 3: Melengkapi Warning untuk seluruh elemen pendukung demi kemudahan debugging
    if (config.input && !SearchUI.input) console.warn("Input Search tidak ditemukan untuk selector: " + config.input);
    if (config.results && !SearchUI.results) console.warn("Container Results tidak ditemukan untuk selector: " + config.results);
    if (config.autocomplete && !SearchUI.autocomplete) console.warn("Container Autocomplete tidak ditemukan untuk selector: " + config.autocomplete);
    if (config.history && !SearchUI.history) console.warn("Container History tidak ditemukan untuk selector: " + config.history);
    if (config.popular && !SearchUI.popular) console.warn("Container Popular tidak ditemukan untuk selector: " + config.popular);
    if (config.status && !SearchUI.status) console.warn("Container Status tidak ditemukan untuk selector: " + config.status);

    // Jalankan setup internal komponen setelah konfigurasi diisi dengan membawa parameter opsi tambahan
    initSearch(config);
}

// ==========================================
// INIT SETUP INTERNAL COMPONENT
// ==========================================
function initSearch(config = {}){

    const input = SearchUI.input;
    if (!input) return; // Proteksi jika elemen input tidak ditemukan di halaman aktif

    // Penyempurnaan Poin 1: Mencegah duplikasi Event Listener jika fungsi dipanggil berulang kali
    if (initialized) return;
    initialized = true;

    // Penyempurnaan Poin 2: Fleksibilitas Autofocus (bisa lewat config object ataupun data-attribute pada HTML)
    const isAutofocus = config.autofocus === true || input.dataset.autofocus === "true";
    if (isAutofocus) {
        input.focus();
    }

    input.addEventListener(
        "input",
        handleSearch
    );

    input.addEventListener(
        "keydown",
        handleKeyboardNavigation
    );

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
                // INTEGRASI LANGKAH 3: Simpan riwayat ke DB saat hasil pencarian diklik
                await saveSearchHistory(card.dataset.keyword);
            }
        });
    }

    if (SearchUI.autocomplete) {
        SearchUI.autocomplete.addEventListener("click", async event => {
            const item = event.target.closest(".autocomplete-item");
            if (item) {
                // INTEGRASI LANGKAH 3: Simpan riwayat ke DB saat item autocomplete diklik
                await saveSearchHistory(item.dataset.keyword);
            }
        });

        // Hover mouse memperbarui indeks navigasi keyboard secara sinkron di dalam area autocomplete saja
        SearchUI.autocomplete.addEventListener("mouseover", event => {
            const item = event.target.closest(".autocomplete-item");
            if(!item) return;

            selectedAutocomplete = Number(item.dataset.index);
            updateAutocompleteSelection();
        });
    }

    if (SearchUI.popular) {
        SearchUI.popular.addEventListener("click", event => {
            if(event.target.classList.contains("popular-btn")){
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
            if(event.target.classList.contains("history-btn")){
                const keyword = event.target.dataset.keyword;
                if (input) {
                    input.value = keyword;
                    keywordAktif = keyword;
                    handleSearch({ target: input });
                }
            }
            // INTEGRASI LANGKAH 3: Hapus item satuan berdasarkan ID database jika ada tombol delete
            if(event.target.classList.contains("delete-history-btn")){
                event.stopPropagation();
                const historyId = event.target.dataset.id;
                if(window.SearchHistoryService) {
                    await window.SearchHistoryService.deleteHistory(historyId);
                    await loadSearchHistory();
                }
            }
            // INTEGRASI LANGKAH 3: Hapus semua riwayat di database
            if(event.target.id === "clear-history"){
                if(window.SearchHistoryService) {
                    await window.SearchHistoryService.clearHistory();
                    await loadSearchHistory();
                }
            }
        });
    }
}

// ==========================================
// EVENT SEARCH (WITH DEBOUNCE & ABORT CONTROLLER)
// ==========================================
async function handleSearch(event){

    const keyword = event.target.value.trim();

    // Menyimpan kata kunci ke variabel global
    keywordAktif = keyword;

    const status = SearchUI.status;
    const results = SearchUI.results;
    const autocomplete = SearchUI.autocomplete;

    // Bersihkan container & batalkan request berjalan jika input kosong
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
        return;
    }

    if (status) {
        status.innerHTML = `
            Mencari:
            <strong>${escapeHtml(keyword)}</strong>
        `;
    }

    // Penyempurnaan Poin 5: Menghindari overload request server dengan mekanisme Debounce (delay 250ms)
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
        
        // Penyempurnaan Poin 6: Batalkan request HTTP lama yang masih menggantung (Stale Request)
        if (searchAbortController) {
            searchAbortController.abort();
        }
        // Buat instansiasi AbortController baru untuk request saat ini
        searchAbortController = new AbortController();
        const signal = searchAbortController.signal;

        // Panggil autocomplete secara dinamis jika kontainernya ada
        if (autocomplete) {
            await loadAutocomplete(keyword, signal);
        }

        // Panggil global search utama jika kontainernya ada
        if (results) {
            await globalSearch(keyword, signal);
        }

    }, 250);
}

// ==========================================
// GLOBAL SEARCH
// ==========================================
async function globalSearch(keyword, signal){

    const results = SearchUI.results;
    if (!results) return;

    results.innerHTML = "<p>Memuat...</p>";

    try{
        const [
            istilah,
            artikel,
            karya,
            sastrawan
        ] = await Promise.all([
            cariIstilah(keyword, signal),
            cariArtikel(keyword, signal),
            cariKarya(keyword, signal),
            cariSastrawan(keyword, signal)
        ]);

        // Pastikan tidak merender data jika request ini sudah dibatalkan di tengah jalan
        if (signal && signal.aborted) return;

        renderSemuaHasil({
            istilah,
            artikel,
            karya,
            sastrawan
        });

    }
    catch(error){
        // Jangan tampilkan pesan error ke user jika kegagalan murni karena Abort-Signal dilakukan sengaja
        if (error.name === 'AbortError' || (error.message && error.message.includes('abort'))) {
            return;
        }
        console.error(error);
        results.innerHTML = "<p>Terjadi kesalahan.</p>";
    }
}

// ==========================================
// AUTOCOMPLETE FUNCTIONS 
// ==========================================

// Fungsi mengambil data untuk Autocomplete (Mendukung Abort Signal)
async function loadAutocomplete(keyword, signal){

    const container = SearchUI.autocomplete;
    if (!container) return;

    if(keyword.length < 2){
        container.innerHTML = "";
        return;
    }

    try {
        const [
            istilah,
            artikel,
            karya,
            sastrawan
        ] = await Promise.all([

            supabaseClient
            .from("istilah")
            .select("nama,slug")
            .ilike("nama", `${keyword}%`)
            .limit(3)
            .abortSignal(signal),

            supabaseClient
            .from("artikel")
            .select("judul,slug")
            .ilike("judul", `${keyword}%`)
            .limit(3)
            .abortSignal(signal),

            supabaseClient
            .from("karya")
            .select("judul,slug")
            .ilike("judul", `${keyword}%`)
            .limit(3)
            .abortSignal(signal),

            supabaseClient
            .from("sastrawan")
            .select("nama,slug")
            .ilike("nama", `${keyword}%`)
            .limit(3)
            .abortSignal(signal)
        ]);

        if (signal && signal.aborted) return;

        const hasil = [];

        istilah.data?.forEach(item => {
            hasil.push({
                label: item.nama,
                type: "Istilah",
                url: `/kamus-istilah/detail.html?slug=${item.slug}`
            });
        });

        artikel.data?.forEach(item => {
            hasil.push({
                label: item.judul,
                type: "Artikel",
                url: `/artikel/detail.html?slug=${item.slug}`
            });
        });

        karya.data?.forEach(item => {
            hasil.push({
                label: item.judul,
                type: "Karya",
                url: `/karya-sastra/detail.html?slug=${item.slug}`
            });
        });

        sastrawan.data?.forEach(item => {
            hasil.push({
                label: item.nama,
                type: "Sastrawan",
                url: `/sastrawan/detail.html?slug=${item.slug}`
            });
        });

        renderAutocomplete(hasil.slice(0, 10));

    } catch (error) {
        if (error.name === 'AbortError') return;
        console.error(error);
    }
}

// Fungsi merender daftar elemen Autocomplete
function renderAutocomplete(items){

    autocompleteItems = items;
    selectedAutocomplete = -1;

    const container = SearchUI.autocomplete;
    if (!container) return;

    if(items.length === 0){
        container.innerHTML = "";
        return;
    }

    container.innerHTML = items.map((item, index) => `
        <a
            class="autocomplete-item"
            data-index="${index}"
            href="${item.url}"
            data-keyword="${escapeHtml(item.label)}"
        >
            <div>
                <strong>
                    ${highlightKeyword(item.label, keywordAktif)}
                </strong>
                <br>
                <small>
                    ${item.type}
                </small>
            </div>
        </a>
    `).join("");

}

// Fungsi navigasi menggunakan keyboard
async function handleKeyboardNavigation(event){

    const input = SearchUI.input;
    if(!input) return;

    // INTEGRASI LANGKAH 3: Deteksi Tombol Enter saat fokus di kolom input biasa
    if(event.key === "Enter" && selectedAutocomplete === -1){
        const keyword = input.value.trim();
        if(!keyword) return;

        event.preventDefault();
        await saveSearchHistory(keyword);

        window.location.href = "/search/index.html?q=" + encodeURIComponent(keyword);
        return;
    }

    if(autocompleteItems.length === 0){
        return;
    }

    if(event.key === "ArrowDown"){
        event.preventDefault();
        selectedAutocomplete++;
        if(selectedAutocomplete >= autocompleteItems.length){
            selectedAutocomplete = 0;
        }
        updateAutocompleteSelection();
    }
    else if(event.key === "ArrowUp"){
        event.preventDefault();
        selectedAutocomplete--;
        if(selectedAutocomplete < 0){
            selectedAutocomplete = autocompleteItems.length - 1;
        }
        updateAutocompleteSelection();
    }
    else if(event.key === "Enter"){
        if(selectedAutocomplete >= 0){
            event.preventDefault();
            // INTEGRASI LANGKAH 3: Simpan riwayat via service sebelum berpindah halaman dari autocomplete
            await saveSearchHistory(autocompleteItems[selectedAutocomplete].label);
            window.location.href = autocompleteItems[selectedAutocomplete].url;
        }
    }
    else if(event.key === "Escape"){
        const container = SearchUI.autocomplete;
        if (container) container.innerHTML = "";
    }

}

// Fungsi sinkronisasi status kelas visual pilihan aktif
function updateAutocompleteSelection(){

    if (!SearchUI.autocomplete) return;

    const items = SearchUI.autocomplete.querySelectorAll(".autocomplete-item");

    items.forEach(item => 
        item.classList.remove("selected")
    );

    if(selectedAutocomplete >= 0 && items[selectedAutocomplete]){
        items[selectedAutocomplete].classList.add("selected");
        items[selectedAutocomplete].scrollIntoView({
            block: "nearest"
        });
    }

}

// ==========================================
// MANAGEMENT RIWAYAT PENCARIAN (INTEGRASI SUPABASE)
// ==========================================

/**
 * INTEGRASI LANGKAH 3: Menyimpan data keyword ke database Supabase
 */
async function saveSearchHistory(keyword){
    const keywordBersih = keyword ? keyword.trim() : "";
    if(!keywordBersih) return;

    if (window.SearchHistoryService) {
        await window.SearchHistoryService.saveSearchHistory(keywordBersih);
        if (SearchUI.history) {
            await loadSearchHistory();
        }
    }
}

/**
 * INTEGRASI LANGKAH 3: Mengambil data riwayat dari database Supabase
 */
async function loadSearchHistory(){
    const container = SearchUI.history;
    if (!container) return;

    let history = [];
    if (window.SearchHistoryService) {
        history = await window.SearchHistoryService.getSearchHistory();
    }

    if(history.length === 0){
        container.innerHTML = "<p>Belum ada riwayat.</p>";
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item-wrapper" style="display: inline-flex; align-items: center; margin-right: 5px;">
            <button
                class="history-btn"
                data-keyword="${escapeHtml(item.keyword)}"
            >
                🕒 ${escapeHtml(item.keyword)}
            </button>
            <button class="delete-history-btn" data-id="${item.id}" style="background:none; border:none; cursor:pointer; padding:0 4px;">×</button>
        </div>
    `).join("")
    +
    `
        <div class="history-actions">
            <button id="clear-history">Hapus Riwayat</button>
        </div>
    `;
}

// ==========================================
// MANAGEMENT PENCARIAN POPULER
// ==========================================

async function loadPopularSearch(){

    const container = SearchUI.popular;
    if (!container) return;

    try{
        const [istilah, artikel, karya, sastrawan] = await Promise.all([

            supabaseClient
            .from("istilah")
            .select("nama,slug,views")
            .order("views", { ascending: false })
            .limit(3),

            supabaseClient
            .from("artikel")
            .select("judul,slug,views")
            .order("views", { ascending: false })
            .limit(3),

            supabaseClient
            .from("karya")
            .select("judul,slug,views")
            .order("views", { ascending: false })
            .limit(3),

            supabaseClient
            .from("sastrawan")
            .select("nama,slug,views")
            .order("views", { ascending: false })
            .limit(3)

        ]);

        const hasil = [
            ...(istilah.data || []).map(item => ({ keyword: item.nama, views: item.views || 0 })),
            ...(artikel.data || []).map(item => ({ keyword: item.judul, views: item.views || 0 })),
            ...(karya.data || []).map(item => ({ keyword: item.judul, views: item.views || 0 })),
            ...(sastrawan.data || []).map(item => ({ keyword: item.nama, views: item.views || 0 }))
        ];

        hasil.sort((a, b) => b.views - a.views);

        renderPopularSearch(hasil.slice(0, 10));

    }
    catch(error){
        console.error(error);
        container.innerHTML = "Gagal memuat.";
    }

}

// ... (Sisa fungsi helper, cariKonten, dan rendering tetap sama di bawah ini) ...

function renderPopularSearch(items){

    const container = SearchUI.popular;
    if (!container) return;

    if(!items.length){
        container.innerHTML = "<p>Belum ada.</p>";
        return;
    }

    container.innerHTML = items.map(item => `
        <button
            class="popular-btn"
            data-keyword="${escapeHtml(item.keyword)}"
        >
            🔥 ${escapeHtml(item.keyword)}
        </button>
    `).join("");

}

async function cariIstilah(keyword, signal){
    const query = supabaseClient
        .from("istilah")
        .select("nama,slug,views")
        .ilike("nama", `%${keyword}%`)
        .limit(5);
    
    if (signal) query.abortSignal(signal);
    const {data} = await query;
    return data || [];
}

async function cariArtikel(keyword, signal){
    const query = supabaseClient
        .from("artikel")
        .select("judul,slug,views")
        .or(`judul.ilike.%${keyword}%,ringkasan.ilike.%${keyword}%`)
        .limit(5);

    if (signal) query.abortSignal(signal);
    const {data} = await query;
    return data || [];
}

async function cariKarya(keyword, signal){
    const query = supabaseClient
        .from("karya")
        .select("judul,slug,views")
        .ilike("judul", `%${keyword}%`)
        .limit(5);

    if (signal) query.abortSignal(signal);
    const {data} = await query;
    return data || [];
}

async function cariSastrawan(keyword, signal){
    const query = supabaseClient
        .from("sastrawan")
        .select("nama,slug,views")
        .ilike("nama", `%${keyword}%`)
        .limit(5);

    if (signal) query.abortSignal(signal);
    const {data} = await query;
    return data || [];
}

function renderSemuaHasil(data){

    const container = SearchUI.results;
    if (!container) return;

    container.innerHTML =
        renderSection("Istilah", data.istilah, "nama", "/kamus-istilah/detail.html?slug=") +
        renderSection("Sastrawan", data.sastrawan, "nama", "/sastrawan/detail.html?slug=") +
        renderSection("Karya Sastra", data.karya, "judul", "/karya-sastra/detail.html?slug=") +
        renderSection("Artikel", data.artikel, "judul", "/artikel/detail.html?slug=");

}

function renderSection(title, items, field, url){

    if(!items.length) return "";

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

function renderCard(item, field, url){

    return `
        <a
            class="search-card"
            href="${url}${item.slug}"
            data-keyword="${escapeHtml(item[field])}"
        >
            <h3>
                ${highlightKeyword(item[field], keywordAktif)}
            </h3>
        </a>
    `;

}

function escapeHtml(text){
    if (text == null) {
        return "";
    }
    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function highlightKeyword(text, keyword){
    if(!keyword || !text) return escapeHtml(text);
    
    const safeText = escapeHtml(text);
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    
    return safeText.replace(regex, "<mark>$1</mark>");
}

function rankResults(items, field){

    const keyword = keywordAktif.toLowerCase().trim();

    return items
        .map(item => {
            const text = (item[field] || "").toLowerCase();
            let score = 0;

            if(text === keyword) score += 1000;
            else if(text.startsWith(keyword)) score += 700;
            else if(text.includes(keyword)) score += 400;

            score += Math.min(item.views || 0, 300);

            return { ...item, score };
        })
        .sort((a, b) => {
            if(b.score !== a.score) return b.score - a.score;
            return a[field].localeCompare(b[field], "id");
        });

}