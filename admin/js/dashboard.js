document.addEventListener("DOMContentLoaded", async () => {

    // 1. Periksa Sesi Login Admin
    const { data } = await adminSupabase.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }

    // LANGKAH 6: Tes Query Manual Sementara (Cek RLS / Koneksi Database)
    const test = await adminSupabase.from("istilah").select("*");
    console.log("TES QUERY MANUAL:", test);

    // 2. Jika Sesi Aman, Ambil Data Statistik
    await loadStatistik();

    // LANGKAH 4: Perbaiki Logout (Dipindahkan ke dalam DOMContentLoaded agar aman)
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutAdmin);
    } else {
        console.error("Tombol dengan ID 'logout-btn' tidak ditemukan di HTML.");
    }
});

// LANGKAH 3: Fungsi loadStatistik dengan Debug Console Log Lengkap
async function loadStatistik() {
    try {
        console.log("Memuat statistik...");

        const [
            istilah,
            kategori,
            referensi,
            artikel
        ] = await Promise.all([
            adminSupabase
                .from("istilah")
                .select("*", { count: "exact", head: true }),

            adminSupabase
                .from("kategori")
                .select("*", { count: "exact", head: true }),

            adminSupabase
                .from("referensi")
                .select("*", { count: "exact", head: true }),

            adminSupabase
                .from("artikel")
                .select("*", { count: "exact", head: true })
        ]);

        console.log("ISTILAH", istilah);
        console.log("KATEGORI", kategori);
        console.log("REFERENSI", referensi);
        console.log("ARTIKEL", artikel);

        // Tampilkan Hasil Count ke Elemen HTML Masing-masing
        document.getElementById("total-istilah").textContent = istilah.count ?? 0;
        document.getElementById("total-kategori").textContent = kategori.count ?? 0;
        document.getElementById("total-referensi").textContent = referensi.count ?? 0;
        document.getElementById("total-artikel").textContent = artikel.count ?? 0;

    } catch (error) {
        console.error("Gagal memuat statistik:", error);
    }
}

// LANGKAH 4: Fungsi Handler untuk Mengamankan Proses Sign Out
async function logoutAdmin() {
    try {
        await adminSupabase.auth.signOut();
        window.location.href = "login.html";
    } catch (error) {
        console.error(error);
        alert("Gagal logout");
    }
}

// LANGKAH 5: Tambahkan Listener Sesi Global (Keluar Otomatis Jika Sesi Habis/Hilang)
adminSupabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
        window.location.href = "login.html";
    }
});