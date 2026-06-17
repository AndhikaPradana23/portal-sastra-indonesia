// ======================================================
// KELOLA ARTIKEL LOGIC
// Portal Sastra Indonesia
// ======================================================

let semuaArtikel = [];

// 1. CEK SESSION & INITIALIZE
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memastikan adminSupabase tersedia dari js/supabase.js atau js/admin-auth.js
        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        loadArtikel();
    }
);

// 2. TOMBOL TAMBAH NAVIGASI
document.getElementById("btn-tambah").addEventListener(
    "click",
    () => {
        location.href = "form-artikel.html";
    }
);

// 3. LOAD DATA ARTIKEL DARI SUPABASE
async function loadArtikel() {
    const { data, error } = await adminSupabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gagal mengambil data artikel:", error);
        return;
    }

    semuaArtikel = data;
    renderArtikel(data);
}

// 4. RENDER DATA KE TABEL HTML
function renderArtikel(data) {
    const tbody = document.getElementById("artikel-body");

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px;">Tidak ada artikel ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td style="padding: 10px;">${item.judul}</td>
            <td style="padding: 10px;">${item.slug}</td>
            <td style="padding: 10px;">
                ${new Date(item.created_at).toLocaleDateString("id-ID")}
            </td>
            <td style="padding: 10px;">
                <button class="btn-edit" onclick="editArtikel('${item.id}')">
                    Edit
                </button>
                <button class="btn-hapus" onclick="hapusArtikel('${item.id}')">
                    Hapus
                </button>
            </td>
        </tr>
    `).join("");
}

// 5. FITUR PENCARIAN (LIVE SEARCH)
document.getElementById("search").addEventListener(
    "input",
    function() {
        const keyword = this.value.toLowerCase().trim();

        const hasil = semuaArtikel.filter(
            artikel => artikel.judul.toLowerCase().includes(keyword)
        );

        renderArtikel(hasil);
    }
);

// 6. EDIT ARTIKEL NAVIGASI
function editArtikel(id) {
    location.href = `form-artikel.html?id=${id}`;
}

// 7. HAPUS ARTIKEL DARI DATABASE
async function hapusArtikel(id) {
    const yakin = confirm("Apakah Anda yakin ingin menghapus artikel ini?");
    if (!yakin) return;

    const { error } = await adminSupabase
        .from("artikel")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Gagal menghapus: " + error.message);
        return;
    }

    // Memuat ulang data setelah berhasil dihapus
    loadArtikel();
}