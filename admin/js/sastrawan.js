// PROTEKSI LOGIN & SESI ADMIN
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memeriksa sesi menggunakan adminSupabase dari admin-auth.js
        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        // Jika lolos proteksi, muat data sastrawan
        loadSastrawan();
    }
);

// AMBIL DATA SASTRAWAN DAN RENDER KE ELEMEN TABEL HTML
async function loadSastrawan() {
    const tbody = document.getElementById("sastrawanTable");

    // Menggunakan adminSupabase, bukan objek import luar
    const { data, error } = await adminSupabase
        .from("sastrawan")
        .select("*")
        .order("nama", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    // Render data ke dalam tabel
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.nama}</td>
            <td>${item.angkatan ?? "-"}</td>
            <td>${item.aliran ?? "-"}</td>
            <td>
                <button onclick="editSastrawan('${item.id}')">
                    Edit
                </button>
                <button onclick="hapusSastrawan('${item.id}')">
                    Hapus
                </button>
            </td>
        </tr>
    `).join("");
}

// Handler Tombol Aksi Tambah Data (Mengarahkan ke Form)
document.getElementById("btn-tambah").addEventListener(
    "click",
    () => {
        location.href = "form-sastrawan.html";
    }
);

// Handler Tombol Aksi Edit Data (Mengarahkan ke Form dengan Parameter ID data)
function editSastrawan(id) {
    location.href = `form-sastrawan.html?id=${id}`;
}

// Handler Tombol Aksi Hapus Data dari Tabel Database
async function hapusSastrawan(id) {
    const yakin = confirm("Yakin ingin menghapus sastrawan ini?");

    if (!yakin) return;

    const { error } = await adminSupabase
        .from("sastrawan")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    // Refresh data tabel setelah proses hapus sukses
    loadSastrawan();
}