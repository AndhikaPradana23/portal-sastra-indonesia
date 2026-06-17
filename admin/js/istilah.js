// LANGKAH 3: Proteksi Login & Sesi Admin
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        loadIstilah();
    }
);

// Ambil Data Istilah dan Render ke Elemen Tabel HTML
async function loadIstilah() {

    const tbody = document.getElementById("istilah-body");

    const { data, error } = await adminSupabase
        .from("istilah")
        .select(`
            *,
            kategori (
                nama
            )
        `)
        .order("nama", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.nama}</td>
            <td>
                ${item.kategori?.nama || "-"}
            </td>
            <td>
                ${item.tingkat || "-"}
            </td>
            <td>
                <button onclick="editIstilah('${item.id}')">
                    Edit
                </button>
                <button onclick="hapusIstilah('${item.id}')">
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
        location.href = "form-istilah.html";
    }
);

// Handler Tombol Aksi Edit Data (Mengarahkan ke Form dengan Parameter ID data)
function editIstilah(id) {
    location.href = `form-istilah.html?id=${id}`;
}

// Handler Tombol Aksi Hapus Data dari Tabel Database Supabase
async function hapusIstilah(id) {

    const yakin = confirm("Hapus istilah?");

    if (!yakin) return;

    const { error } = await adminSupabase
        .from("istilah")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    // Refresh data tabel setelah proses hapus sukses
    loadIstilah();
}