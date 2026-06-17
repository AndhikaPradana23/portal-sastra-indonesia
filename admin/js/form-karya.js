// ==========================================
// 1. INISIALISASI VARIABEL GLOBAL & DOM
// ==========================================
let editId = null;

const form = document.getElementById("form-karya");
const judul = document.getElementById("judul");
const slug = document.getElementById("slug");
const jenis = document.getElementById("jenis");
const tahun = document.getElementById("tahun");
const deskripsi = document.getElementById("deskripsi");
const artikelList = document.getElementById("artikel-list");

// Proteksi Halaman & Cek Parameter Edit URL
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Ambil sesi login admin dari Supabase
        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        // Tangkap parameter ID dari URL jika dalam mode Edit
        const params = new URLSearchParams(location.search);
        editId = params.get("id");

        // Muat daftar seluruh artikel terlebih dahulu
        await loadDaftarArtikel();

        if (editId) {
            const judulForm = document.getElementById("judul-form");
            if (judulForm) {
                judulForm.textContent = "Edit Karya";
            }
            loadData(editId);
            // Muat relasi artikel yang tercentang untuk karya ini
            await loadRelasiArtikel(editId);
        }
    }
);

// ==========================================
// 2. AUTO GENERATE SLUG VIA INPUT JUDUL
// ==========================================
if (judul) {
    judul.addEventListener(
        "input",
        function() {
            // Jika sedang mengedit data lama, slug tidak boleh berubah otomatis
            if (editId) return;

            if (slug) {
                slug.value = generateSlug(this.value);
            }
        }
    );
}

function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Hapus karakter non-alphanumeric kecuali spasi dan tanda minus
        .replace(/\s+/g, "-");    // Ganti spasi beruntun menjadi satu tanda minus
}

// ==========================================
// 3. LOAD DATA SAAT EDIT & RELASI ARTIKEL
// ==========================================
async function loadData(id) {
    const { data, error } = await adminSupabase
        .from("karya")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    // Isikan data database ke dalam kolom form input masing-masing
    if (judul) judul.value = data.judul || "";
    if (slug) slug.value = data.slug || "";
    if (jenis) jenis.value = data.jenis || "";
    if (tahun) tahun.value = data.tahun || "";
    if (deskripsi) deskripsi.value = data.deskripsi || "";
}

async function loadDaftarArtikel() {
    const { data, error } = await adminSupabase
        .from("artikel")
        .select("id,judul")
        .order("judul");

    if (error) {
        artikelList.innerHTML = "Gagal memuat artikel.";
        return;
    }

    artikelList.innerHTML = data.map(item => `
        <label style="display:block;margin-bottom:8px;">
            <input
                type="checkbox"
                class="artikel-checkbox"
                value="${item.id}"
            >
            ${item.judul}
        </label>
    `).join("");
}

async function loadRelasiArtikel(karyaId) {
    const { data } = await adminSupabase
        .from("artikel_karya")
        .select("artikel_id")
        .eq("karya_id", karyaId);

    if (!data) return;

    const ids = data.map(item => item.artikel_id);

    document
        .querySelectorAll(".artikel-checkbox")
        .forEach(item => {
            item.checked = ids.includes(item.value);
        });
}

// ==========================================
// 4. SIMPAN DATA (INSERT / UPDATE) & SINKRONISASI
// ==========================================
if (form) {
    form.addEventListener(
        "submit",
        async function(e) {
            e.preventDefault();

            // Susun data payload sebelum dikirim ke tabel Supabase
            const payload = {
                judul: judul ? judul.value.trim() : "",
                slug: slug ? slug.value.trim() : "",
                jenis: jenis ? jenis.value : "",
                tahun: (tahun && tahun.value) ? parseInt(tahun.value) : null,
                deskripsi: deskripsi ? deskripsi.value.trim() : "",
                updated_at: new Date()
            };

            let response;

            if (editId) {
                // Mode Perbarui Data Lama (Update)
                response = await adminSupabase
                    .from("karya")
                    .update(payload)
                    .eq("id", editId);
            } else {
                // Mode Tambah Data Baru (Insert) - Ditambahkan .select().single() agar menghasilkan data id baru
                response = await adminSupabase
                    .from("karya")
                    .insert([payload])
                    .select()
                    .single();
            }

            if (response.error) {
                alert(response.error.message);
                return;
            }

            // Dapatkan id karya baik dari mode edit maupun hasil insert baru
            const karyaId = editId ? editId : response.data.id;

            // Bersihkan relasi lama yang bersangkutan dengan karyaId ini
            await adminSupabase
                .from("artikel_karya")
                .delete()
                .eq("karya_id", karyaId);

            // Ambil daftar checkbox artikel yang dicentang admin
            const artikelDipilih = document.querySelectorAll(".artikel-checkbox:checked");

            const artikelData = [...artikelDipilih].map(item => ({
                karya_id: karyaId,
                artikel_id: item.value
            }));

            // Jika ada artikel yang dicentang, masukkan ke tabel relasi artikel_karya
            if (artikelData.length) {
                await adminSupabase
                    .from("artikel_karya")
                    .insert(artikelData);
            }

            alert("Data berhasil disimpan");
            location.href = "karya.html";
        }
    );
}