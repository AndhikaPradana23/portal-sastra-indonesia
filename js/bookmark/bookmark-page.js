// ==========================================================================
// BOOKMARK PAGE CONTROLLER / MANAGEMENT
// ==========================================================================

// Langkah 2: Menambahkan State Filter & Search Global
let currentBookmarkType = "all";
let bookmarkKeyword = "";

/**
 * Langkah 4: Menginisialisasi event listener pada kotak pencarian (search box).
 * Mendengarkan setiap ketikan user untuk memperbarui kata kunci pencarian.
 */
function initBookmarkSearch() {
    const input = document.getElementById("bookmark-search");

    if (!input) {
        return;
    }

    input.addEventListener("input", async (event) => {
        // Ambil nilai teks, hapus spasi di awal/akhir, dan ubah ke huruf kecil
        bookmarkKeyword = event.target.value.trim().toLowerCase();

        // Picu render ulang daftar data agar langsung tersaring secara live
        await renderFilteredBookmarks();
    });
}

/**
 * Menginisialisasi event listener klik pada setiap tombol filter kategori.
 * Mengatur kelas aktif dan memicu render ulang daftar data yang sudah terfilter.
 */
function initBookmarkFilter() {
    const buttons = document.querySelectorAll(".bookmark-filter-btn");

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            // Update state tipe data saat ini dari atribut 'data-type' HTML
            currentBookmarkType = button.dataset.type;

            // Bersihkan kelas active dari seluruh tombol filter
            buttons.forEach(btn => {
                btn.classList.remove("active");
            });

            // Tambahkan kelas active ke tombol yang baru saja diklik
            button.classList.add("active");

            // Render ulang daftar data agar langsung tersaring secara reaktif
            await renderFilteredBookmarks();
        });
    });
}

/**
 * Langkah 9: Menginisialisasi event listener klik pada setiap tombol aksi ekspor.
 * Menghubungkan elemen UI HTML secara aman dengan fungsi utilitas BookmarkExport.
 */
function initBookmarkExport() {
    document
        .getElementById("export-json")
        ?.addEventListener("click", () => {
            BookmarkExport.exportBookmarkJSON();
        });

    document
        .getElementById("export-csv")
        ?.addEventListener("click", () => {
            BookmarkExport.exportBookmarkCSV();
        });

    document
        .getElementById("export-txt")
        ?.addEventListener("click", () => {
            BookmarkExport.exportBookmarkTXT();
        });
}

/**
 * Membaca data mentah dari database, menyaringnya berdasarkan kombinasi tipe 
 * DAN kata kunci pencarian, lalu mengirimkannya ke modul komponen renderer.
 */
async function renderFilteredBookmarks() {
    // Langkah 5: Mutakhirkan komponen kotak angka statistik (summary) sebelum merender list
    if (typeof renderBookmarkCount === "function") {
        await renderBookmarkCount();
    }

    // --- LANGKAH 5: MENGAMBIL DATA DARI DATABASE SUPABASE VIA SERVICE ---
    let allBookmarks = [];
    if (window.BookmarkService && typeof window.BookmarkService.getBookmarks === "function") {
        allBookmarks = await window.BookmarkService.getBookmarks();
    } else if (typeof getBookmarks === "function") {
        allBookmarks = await getBookmarks();
    }

    // Saring data menggunakan kombinasi Filter Kategori dan Keyword Pencarian
    const filteredList = allBookmarks.filter(item => {
        // 1. Cek kecocokan kategori tipe
        const matchType = currentBookmarkType === "all" || item.tipe === currentBookmarkType;
        
        // 2. Cek kecocokan teks kata kunci pada judul bookmark
        const itemTitle = (item.judul || "").toLowerCase();
        const matchKeyword = itemTitle.includes(bookmarkKeyword);

        // Keduanya harus terpenuhi (TRUE) agar data lolos saringan
        return matchType && matchKeyword;
    });

    // Kirim hasil akhir data yang lolos penyaringan ganda ke file 'bookmark-renderer.js'
    if (typeof renderBookmarkList === "function") {
        renderBookmarkList(filteredList);
    }
}

/**
 * Langkah 8: Refactor fungsi inisialisasi utama halaman bookmark.
 * Memanggil modul search, filter, sistem ekspor berkas, serta merender data awal.
 */
async function initBookmarkPage() {
    // Siapkan event listener kotak pencarian kata kunci
    initBookmarkSearch();

    // Siapkan event listener tombol filter navigasi
    initBookmarkFilter();

    // Siapkan event listener penanganan tombol unduh dokumen/berkas ekspor
    initBookmarkExport();

    // Jalankan render data awal (menghitung angka statistik & menampilkan kategori 'Semua')
    await renderFilteredBookmarks();
}

// Pasang trigger otomatis saat seluruh struktur halaman HTML selesai dimuat
document.addEventListener("DOMContentLoaded", initBookmarkPage);