// VARIABEL STATUS GLOBAL
let kategoriAktif = null;
let hurufAktif = "";
let tingkatAktif = ""; 

// ==========================================
// FUNGSI UNTUK MEMUAT DAFTAR KATEGORI
// ==========================================
async function loadKategori() {
    const kategoriContainer = document.getElementById("kategori-list");

    if (!kategoriContainer) {
        console.error("Elemen kategori-list tidak ditemukan.");
        return;
    }

    const { data, error } = await supabaseClient
        .from("kategori")
        .select("*")
        .order("nama", { ascending: true });

    if (error) {
        console.error("Gagal memuat kategori:", error);
        return;
    }

    kategoriContainer.innerHTML = `
        <button class="kategori-btn aktif" data-id="">
            Semua
        </button>
        ${data.map(item => `
            <button class="kategori-btn" data-id="${item.id}">
                ${escapeHtml(item.nama)}
            </button>
        `).join("")}
    `;
}

// ==========================================
// FUNGSI UTAMA UNTUK MEMUAT DATA ISTILAH
// ==========================================
async function loadIstilah(kategoriId = null, keyword = "", huruf = "", tingkat = "") {

    const loading = document.getElementById("loading");
    const container = document.getElementById("daftar-istilah");

    if (!loading || !container) {
        console.error("Elemen loading atau daftar-istilah tidak ditemukan.");
        return;
    }

    try {
        loading.style.display = "block";
        console.log("Memulai koneksi ke Supabase...");

        // Inisialisasi query dasar istilah
        let query = supabaseClient
            .from("istilah")
            .select("*");

        // Filter 1: Kategori (Exact Match)
        if (kategoriId) {
            query = query.eq("kategori_id", kategoriId);
        }

        // Filter 2: Kata Kunci Teks (Partial Match)
        if (keyword && keyword.trim() !== "") {
            query = query.ilike("nama", `%${keyword}%`);
        }

        // Filter 3: Huruf Alfabet Depan (Prefix Match)
        if (huruf && huruf !== "") {
            query = query.ilike("nama", `${huruf}%`);
        }

        // Filter 4: Tingkat Kesulitan setelah Filter Huruf
        if (tingkat && tingkat !== "") {
            query = query.eq("tingkat", tingkat);
        }

        // Jalankan seluruh rangkaian query di atas secara terurut alfabetis
        const response = await query.order("nama", { ascending: true });

        console.log("Response Supabase:");
        console.log(response);

        const { data, error } = response;

        loading.style.display = "none";

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty">
                    <h3>Data istilah tidak ditemukan atau kategori masih kosong</h3>
                </div>
            `;
            return;
        }

        // Perubahan 1 — Card istilah modern
        const html = data.map(item => `
        <article class="istilah-card card fade-up">
            <div class="istilah-header">
                <div>
                    <h2>
                        <img
                            src="/assets/icons/book-open.svg"
                            class="inline-icon"
                            alt="">
                        ${escapeHtml(item.nama)}
                    </h2>
                    <span class="badge-tingkat">
                        ${escapeHtml(item.tingkat)}
                    </span>
                </div>
            </div>
            <p class="definisi">
                ${escapeHtml(
                    potongTeks(item.definisi, 180)
                )}
            </p>
            <a
                href="detail.html?slug=${encodeURIComponent(item.slug)}"
                class="btn-detail">
                <span>Lihat Detail</span>
                <img
                    src="/assets/icons/arrow-right.svg"
                    class="btn-detail-icon"
                    alt="">
            </a>
        </article>
        `).join("");

        container.innerHTML = html;

        console.log("Data berhasil dimuat:");
        console.table(data);

    } catch (error) {

        console.error("=== ERROR SUPABASE ===");
        console.error(error);

        const errorMessage = error?.message || "Unknown error";
        const errorCode = error?.code || "No code";

        container.innerHTML = `
            <div class="error">
                <h3>Gagal memuat data istilah</h3>
                <p><strong>Pesan:</strong> ${errorMessage}</p>
                <p><strong>Kode:</strong> ${errorCode}</p>
                <p>Lihat Console (F12) untuk detail lengkap.</p>
            </div>
        `;
    }
}

// ==========================================
// FUNGSI UTILITY, PENOLONG (HELPER) & RIWAYAT
// ==========================================
function potongTeks(teks, panjang) {
    if (!teks) return "";
    if (teks.length <= panjang) {
        return teks;
    }
    return teks.substring(0, panjang) + "...";
}

// Fungsi Membantu Menghindari Celah XSS Berbahaya
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Fungsi Memuat Riwayat Pencarian dari LocalStorage pembaca browser
function loadHistory() {
    const container = document.getElementById("history-list");
    
    if (!container) return;

    const history = JSON.parse(localStorage.getItem("kamusHistory")) || [];

    if (history.length === 0) {
        container.innerHTML = "<p>Belum ada riwayat.</p>";
        return;
    }

    container.innerHTML = history.map(item => `
        <a href="detail.html?slug=${item.slug}" class="history-item">
            ${escapeHtml(item.nama)}
        </a>
    `).join("");
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Listener Aksi klik Tombol Hapus Riwayat Pencarian
document.addEventListener("click", function (event) {
    if (event.target.id === "clear-history") {
        localStorage.removeItem("kamusHistory");
        loadHistory();
    }
});

// Update Event Filter Klik Pilihan Kategori
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("kategori-btn")) {
        
        document.querySelectorAll(".kategori-btn").forEach(btn =>
            btn.classList.remove("aktif")
        );

        event.target.classList.add("aktif");

        const kategoriId = event.target.dataset.id;
        kategoriAktif = kategoriId || null;

        const searchInput = document.getElementById("search-input");
        const keyword = searchInput ? searchInput.value : "";

        loadIstilah(kategoriAktif, keyword, hurufAktif, tingkatAktif);
    }
});

// Update Event Filter Klik Pilihan Karakter Alfabet A-Z
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("az-btn")) {

        document.querySelectorAll(".az-btn").forEach(btn =>
            btn.classList.remove("aktif")
        );

        event.target.classList.add("aktif");

        hurufAktif = event.target.dataset.huruf;

        const searchInput = document.getElementById("search-input");
        const keyword = searchInput ? searchInput.value : "";

        loadIstilah(kategoriAktif, keyword, hurufAktif, tingkatAktif);
    }
});

// Event Klik Penyaringan Berdasarkan Tingkat Kesulitan istilah
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("tingkat-btn")) {

        document.querySelectorAll(".tingkat-btn").forEach(btn =>
            btn.classList.remove("aktif")
        );

        event.target.classList.add("aktif");

        tingkatAktif = event.target.dataset.tingkat;

        const searchInput = document.getElementById("search-input");
        const keyword = searchInput ? searchInput.value : "";

        loadIstilah(kategoriAktif, keyword, hurufAktif, tingkatAktif);
    }
});

// Update Pencarian Dinamis Saat Mengetik Sesuatu di Input Form
document.addEventListener("input", function (event) {
    if (event.target.id === "search-input") {
        
        loadIstilah(kategoriAktif, event.target.value, hurufAktif, tingkatAktif);
    }
});

// Menangani Inisialisasi Awal Ketika Halaman Selesai Dimuat Browser dengan Layout Dahulu
document.addEventListener("DOMContentLoaded", async () => {
    await loadLayout();

    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Kamus",
                icon: "/assets/icons/book-open.svg"
            }
        ]);
    }

    console.log("Halaman Kamus dimuat");
    console.log("Supabase URL:", SUPABASE_URL);

    updateSEO();

    // Memuat filter kategori dari database
    loadKategori();

    // Memuat komponen daftar riwayat terakhir dicari
    loadHistory();

    // Memuat seluruh data awal secara utuh (semua parameter kosong bawaan)
    loadIstilah();
});

// ==========================================
// SEO HALAMAN DAFTAR KAMUS
// ==========================================
function updateSEO(){

    const title =
    "Kamus Istilah Sastra Indonesia | Portal Sastra Indonesia";

    const description =
    "Kamus istilah sastra Indonesia lengkap berisi definisi, contoh, penjelasan, referensi akademik, contoh penggunaan, dan istilah terkait.";

    document.title = title;

    document
    .getElementById(
        "meta-description"
    )
    .content =
    description;

    document
    .getElementById(
        "canonical-url"
    )
    .href =
    window.location.href;

    document
    .getElementById(
        "og-title"
    )
    .content =
    title;

    document
    .getElementById(
        "og-description"
    )
    .content =
    description;

    document
    .getElementById(
        "og-url"
    )
    .content =
    window.location.href;

    document
    .getElementById(
        "twitter-title"
    )
    .content =
    title;

    document
    .getElementById(
        "twitter-description"
    )
    .content =
    description;

}

// Segarkan Riwayat Secara Otomatis Saat Kembali ke Tab/Halaman Kamus
window.addEventListener("focus", loadHistory);