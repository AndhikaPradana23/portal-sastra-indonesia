// LANGKAH 2: Cek Session Admin Saat DOM Selesai Dimuat
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        loadKategori();
    }
);

// LANGKAH 3: Menampilkan Semua Kategori ke Elemen Tabel HTML
async function loadKategori() {

    const tbody = document.getElementById("kategori-body");

    const { data, error } = await adminSupabase
        .from("kategori")
        .select("*")
        .order("nama");

    if (error) {
        console.error(error);
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>
                ${item.nama}
            </td>
            <td>
                <button onclick="editKategori('${item.id}')">
                    Edit
                </button>
                <button onclick="hapusKategori('${item.id}')">
                    Hapus
                </button>
            </td>
        </tr>
    `).join("");
}

// LANGKAH 4: Tambah Kategori Baru Menggunakan Prompt Browser
document.getElementById("btn-tambah-kategori").addEventListener(
    "click",
    async () => {

        const nama = prompt("Nama kategori:");

        if (!nama) return;

        const { error } = await adminSupabase
            .from("kategori")
            .insert([
                {
                    nama
                }
            ]);

        if (error) {
            alert(error.message);
            return;
        }

        // Segarkan data tabel setelah berhasil ditambah
        loadKategori();
    }
);

// LANGKAH 5: Edit Kategori Menggunakan Prompt Browser
async function editKategori(id) {

    const { data } = await adminSupabase
        .from("kategori")
        .select("*")
        .eq("id", id)
        .single();

    const namaBaru = prompt("Edit kategori:", data.nama);

    if (!namaBaru) return;

    const { error } = await adminSupabase
        .from("kategori")
        .update({
            nama: namaBaru
        })
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    // Segarkan data tabel setelah berhasil diubah
    loadKategori();
}

// LANGKAH 6: Hapus Kategori Dengan Validasi Relasi (Foreign Key Check)
async function hapusKategori(id) {

    // Cek terlebih dahulu apakah ID kategori ini masih dipakai di tabel istilah
    const { count } = await adminSupabase
        .from("istilah")
        .select("*", { count: "exact", head: true })
        .eq("kategori_id", id);

    if (count > 0) {
        alert("Kategori gagal dihapus! Kategori ini masih digunakan oleh data istilah.");
        return;
    }

    const yakin = confirm("Hapus kategori?");

    if (!yakin) return;

    const { error } = await adminSupabase
        .from("kategori")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    // Segarkan data tabel setelah berhasil dihapus
    loadKategori();
}