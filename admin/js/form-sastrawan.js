// ==========================================
// 1. INISIALISASI VARIABEL GLOBAL & PROTEKSI
// ==========================================
let editId = null;
let currentFotoUrl = ""; // Menyimpan URL foto lama jika dalam mode edit dan user tidak ganti foto

// Ambil referensi elemen form dari DOM HTML
const formSastrawan = document.getElementById("form-sastrawan");
const inputNama = document.getElementById("nama");
const inputSlug = document.getElementById("slug");
const inputFoto = document.getElementById("foto");
const inputTempatLahir = document.getElementById("tempat_lahir");
const inputTanggalLahir = document.getElementById("tanggal_lahir");
const inputTanggalWafat = document.getElementById("tanggal_wafat");
const inputAngkatan = document.getElementById("angkatan");
const inputAliran = document.getElementById("aliran");
const jenisCheckbox = document.querySelectorAll(".jenis-checkbox");
const inputBiografiSingkat = document.getElementById("biografi_singkat");
const inputBiografiLengkap = document.getElementById("biografi_lengkap");
const karyaList = document.getElementById("karya-list");

// Elemen Penghargaan Dinamis
const penghargaanList = document.getElementById("penghargaan-list");
const btnTambahPenghargaan = document.getElementById("btn-tambah-penghargaan");

// Elemen Referensi Akademik Dinamis
const referensiList = document.getElementById("referensi-list");
const btnTambahReferensi = document.getElementById("btn-tambah-referensi");

// Elemen Artikel Terkait Dinamis
const artikelList = document.getElementById("artikel-list");

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Proteksi Login Sesi Admin (Menggunakan adminSupabase dari admin-auth.js)
        const { data } = await adminSupabase.auth.getSession();

        if (!data.session) {
            location.href = "login.html";
            return;
        }

        // Ambil ID dari URL parameter jika dalam mode Edit
        const params = new URLSearchParams(location.search);
        editId = params.get("id");

        // Load semua daftar karya dan artikel terlebih dahulu (baik mode Tambah maupun Edit)
        await loadDaftarKarya();
        await loadDaftarArtikel();

        if (editId) {
            const judulForm = document.getElementById("judul-form");
            if (judulForm) {
                judulForm.textContent = "Edit Sastrawan";
            }
            await loadData(editId);
            await loadRelasiKarya(editId);
            await loadPenghargaan(editId);
            await loadReferensi(editId);
            await loadRelasiArtikel(editId);
        }

        // Jika membuka form baru (bukan edit), langsung munculkan field kosong bawaan
        if (!editId) {
            tambahPenghargaan();
            tambahReferensi();
        }
    }
);

// ==========================================
// MANAJEMEN INPUT PENGHARGAAN DINAMIS
// ==========================================
function tambahPenghargaan(data = {}) {
    const item = document.createElement("div");
    item.className = "penghargaan-item";
    item.style.marginBottom = "20px";
    item.style.padding = "15px";
    item.style.border = "1px solid #ddd";
    item.style.borderRadius = "8px";

    item.innerHTML = `
        <input
            type="text"
            class="penghargaan-nama"
            placeholder="Nama Penghargaan"
            value="${data.nama || ""}"
            style="width:100%;margin-bottom:10px;"
        >
        <input
            type="number"
            class="penghargaan-tahun"
            placeholder="Tahun"
            value="${data.tahun || ""}"
            style="width:200px;margin-bottom:10px;"
        >
        <textarea
            class="penghargaan-keterangan"
            rows="3"
            placeholder="Keterangan"
        >${data.keterangan || ""}</textarea>
        <br><br>
        <button type="button" class="hapus-penghargaan">
            Hapus
        </button>
    `;

    item.querySelector(".hapus-penghargaan").onclick = () => {
        item.remove();
    };

    penghargaanList.appendChild(item);
}

if (btnTambahPenghargaan) {
    btnTambahPenghargaan.onclick = () => {
        tambahPenghargaan();
    };
}

async function loadPenghargaan(id) {
    const { data, error } = await adminSupabase
        .from("penghargaan_sastrawan")
        .select("*")
        .eq("sastrawan_id", id)
        .order("tahun");

    if (error) {
        console.error("Gagal memuat data penghargaan:", error);
        return;
    }

    penghargaanList.innerHTML = "";

    if (data.length == 0) {
        tambahPenghargaan();
        return;
    }

    data.forEach(item => {
        tambahPenghargaan(item);
    });
}

// ==========================================
// MANAJEMEN INPUT REFERENSI DINAMIS
// ==========================================
function tambahReferensi(data={}){
    const item = document.createElement("div");
    item.className="referensi-item";
    item.style.marginBottom="20px";
    item.style.padding="15px";
    item.style.border="1px solid #ddd";
    item.style.borderRadius="8px";

    item.innerHTML=`
        <input
            type="text"
            class="referensi-penulis"
            placeholder="Penulis"
            value="${data.penulis||""}"
            style="width:100%;margin-bottom:10px;"
        >
        <input
            type="text"
            class="referensi-judul"
            placeholder="Judul"
            value="${data.judul||""}"
            style="width:100%;margin-bottom:10px;"
        >
        <input
            type="text"
            class="referensi-penerbit"
            placeholder="Penerbit"
            value="${data.penerbit||""}"
            style="width:100%;margin-bottom:10px;"
        >
        <input
            type="number"
            class="referensi-tahun"
            placeholder="Tahun"
            value="${data.tahun||""}"
            style="width:200px;margin-bottom:10px;"
        >
        <input
            type="text"
            class="referensi-url"
            placeholder="URL (opsional)"
            value="${data.url||""}"
            style="width:100%;margin-bottom:10px;"
        >
        <button
            type="button"
            class="hapus-referensi"
        >
            Hapus
        </button>
    `;

    item.querySelector(".hapus-referensi").onclick=()=>{
        item.remove();
    };

    referensiList.appendChild(item);
}

if (btnTambahReferensi) {
    btnTambahReferensi.onclick=()=>{
        tambahReferensi();
    };
}

async function loadReferensi(id){
    const { data, error } = await adminSupabase
        .from("referensi_sastrawan")
        .select("*")
        .eq("sastrawan_id", id)
        .order("tahun");

    if(error){
        console.error(error);
        return;
    }

    referensiList.innerHTML="";

    if(data.length===0){
        tambahReferensi();
        return;
    }

    data.forEach(item=>{
        tambahReferensi(item);
    });
}

// ==========================================
// PREVIEW OTOMATIS SEBELUM UPLOAD
// ==========================================
if (inputFoto) {
    inputFoto.addEventListener(
        "change",
        function () {
            const file = this.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                const preview = document.getElementById("preview-foto");
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                }
            };

            reader.readAsDataURL(file);
        }
    );
}

// ==========================================
// 2. AUTO GENERATE SLUG
// ==========================================
if (inputNama) {
    inputNama.addEventListener(
        "input",
        function() {
            // Jika sedang mengedit data lama, slug tidak boleh berubah otomatis
            if (editId) return;

            if (inputSlug) {
                inputSlug.value = generateSlug(this.value);
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
// 3. LOAD DATA SAAT EDIT
// ==========================================
async function loadData(id) {
    const { data, error } = await adminSupabase
        .from("sastrawan")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    // Isikan data database ke dalam kolom form input masing-masing
    if (inputNama) inputNama.value = data.nama || "";
    if (inputSlug) inputSlug.value = data.slug || "";
    
    // Simpan url foto lama ke variabel global & tampilkan pada elemen preview jika ada
    if (data.foto) {
        currentFotoUrl = data.foto;
        const preview = document.getElementById("preview-foto");
        if (preview) {
            preview.src = data.foto;
            preview.style.display = "block";
        }
    }

    if (inputTempatLahir) inputTempatLahir.value = data.tempat_lahir || "";
    if (inputTanggalLahir) inputTanggalLahir.value = data.tanggal_lahir || "";
    if (inputTanggalWafat) inputTanggalWafat.value = data.tanggal_wafat || "";
    if (inputAngkatan) inputAngkatan.value = data.angkatan || "";
    if (inputAliran) inputAliran.value = data.aliran || "";

    if (Array.isArray(data.jenis)) {
        document
            .querySelectorAll(".jenis-checkbox")
            .forEach(item => {
                item.checked =
                    data.jenis.includes(
                        item.value
                    );
            });
    }

    if (inputBiografiSingkat) inputBiografiSingkat.value = data.biografi_singkat || "";
    if (inputBiografiLengkap) inputBiografiLengkap.value = data.biografi_lengkap || "";
}

// ==========================================
// 4. LOAD DAFTAR SEMUA KARYA (OPTIONS)
// ==========================================
async function loadDaftarKarya() {
    if (!karyaList) return;

    const { data, error } = await adminSupabase
        .from("karya")
        .select("*")
        .order("judul", { ascending: true });

    if (error) {
        karyaList.innerHTML = "<em style='color:red;'>Gagal memuat daftar karya.</em>";
        return;
    }

    if (data.length === 0) {
        karyaList.innerHTML = "<em>Belum ada data karya di database.</em>";
        return;
    }

    karyaList.innerHTML = data.map(item => `
        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" class="karya-checkbox" value="${item.id}">
            ${item.judul}
            <small style="color: #666;">(${item.jenis || "-"})</small>
        </label>
    `).join("");
}

// ==========================================
// LOAD DAFTAR ARTIKEL (OPTIONS)
// ==========================================
async function loadDaftarArtikel() {
    if (!artikelList) return;

    const { data, error } = await adminSupabase
        .from("artikel")
        .select("id, judul")
        .order("judul");

    if (error) {
        artikelList.innerHTML = "<em style='color:red;'>Gagal memuat artikel.</em>";
        return;
    }

    if (data.length === 0) {
        artikelList.innerHTML = "<em>Belum ada artikel.</em>";
        return;
    }

    artikelList.innerHTML = data.map(item => `
        <label style="display:block; margin-bottom:8px;">
            <input type="checkbox" class="artikel-checkbox" value="${item.id}">
            ${item.judul}
        </label>
    `).join("");
}

// ==========================================
// 5. LOAD RELASI KARYA YANG TERCENTANG SAAT EDIT
// ==========================================
async function loadRelasiKarya(sastrawanId) {
    const { data, error } = await adminSupabase
        .from("sastrawan_karya")
        .select("karya_id")
        .eq("sastrawan_id", sastrawanId);

    if (error) {
        console.error("Gagal memuat relasi karya:", error);
        return;
    }

    const karyaIds = data.map(item => item.karya_id);

    document.querySelectorAll(".karya-checkbox").forEach(checkbox => {
        checkbox.checked = karyaIds.includes(checkbox.value);
    });
}

// ==========================================
// LOAD RELASI ARTIKEL YANG TERCENTANG SAAT EDIT
// ==========================================
async function loadRelasiArtikel(sastrawanId){
    const { data, error } = await adminSupabase
        .from("artikel_sastrawan")
        .select("artikel_id")
        .eq("sastrawan_id", sastrawanId);

    if(error){
        console.error(error);
        return;
    }

    const artikelIds = data.map(item=>item.artikel_id);

    document.querySelectorAll(".artikel-checkbox").forEach(item=>{
        item.checked = artikelIds.includes(item.value);
    });
}

// ==========================================
// 6. SIMPAN DATA & SINKRONISASI RELASI
// ==========================================
if (formSastrawan) {
    formSastrawan.addEventListener(
        "submit",
        async function(e) {
            e.preventDefault();

            // Default menggunakan foto lama (jika ada / saat mode edit)
            let fotoUrl = currentFotoUrl;

            // Jika user memilih file baru, lakukan proses unggah ke Supabase Storage
            if (inputFoto && inputFoto.files && inputFoto.files[0]) {
                const file = inputFoto.files[0];
                const namaFile = Date.now() + "-" + file.name;

                const { error: uploadError } = await adminSupabase
                    .storage
                    .from("sastrawan")
                    .upload(namaFile, file);

                if (uploadError) {
                    alert("Gagal mengunggah foto: " + uploadError.message);
                    return;
                }

                const { data: urlData } = adminSupabase
                    .storage
                    .from("sastrawan")
                    .getPublicUrl(namaFile);

                fotoUrl = urlData.publicUrl;
            }

            // Susun data payload sebelum dikirim ke tabel Supabase
            const payload = {
                nama: inputNama ? inputNama.value.trim() : "",
                slug: inputSlug ? inputSlug.value.trim() : "",
                foto: fotoUrl,
                tempat_lahir: inputTempatLahir ? inputTempatLahir.value.trim() : "",
                tanggal_lahir: (inputTanggalLahir && inputTanggalLahir.value) ? inputTanggalLahir.value : null,
                tanggal_wafat: (inputTanggalWafat && inputTanggalWafat.value) ? inputTanggalWafat.value : null,
                angkatan: inputAngkatan ? inputAngkatan.value : "",
                aliran: inputAliran ? inputAliran.value.trim() : "",
                jenis: [
                    ...document.querySelectorAll(
                        ".jenis-checkbox:checked"
                    )
                ].map(item=>item.value),
                biografi_singkat: inputBiografiSingkat ? inputBiografiSingkat.value.trim() : "",
                biografi_lengkap: inputBiografiLengkap ? inputBiografiLengkap.value.trim() : "",
                updated_at: new Date()
            };

            let response;
            let sastrawanId;

            if (editId) {
                // Mode Perbarui Data Lama (Update)
                response = await adminSupabase
                    .from("sastrawan")
                    .update(payload)
                    .eq("id", editId);
                
                if (response.error) {
                    alert(response.error.message);
                    return;
                }
                
                sastrawanId = editId;
            } else {
                // Mode Tambah Data Baru (Insert) dengan return data ID baru
                response = await adminSupabase
                    .from("sastrawan")
                    .insert([payload])
                    .select()
                    .single();

                if (response.error) {
                    alert(response.error.message);
                    return;
                }

                sastrawanId = response.data.id;
            }

            // ==========================================
            // SINKRONISASI PENGHARGAAN (RESET & RE-INSERT)
            // ==========================================
            await adminSupabase
                .from("penghargaan_sastrawan")
                .delete()
                .eq("sastrawan_id", sastrawanId);

            const penghargaanData = [];

            document.querySelectorAll(".penghargaan-item").forEach(item => {
                const nama = item.querySelector(".penghargaan-nama").value.trim();
                
                if (!nama) return; // Lewati jika nama penghargaan kosong

                penghargaanData.push({
                    sastrawan_id: sastrawanId,
                    nama: nama,
                    tahun: item.querySelector(".penghargaan-tahun").value || null,
                    keterangan: item.querySelector(".penghargaan-keterangan").value.trim()
                });
            });

            if (penghargaanData.length > 0) {
                const { error: penghargaanError } = await adminSupabase
                    .from("penghargaan_sastrawan")
                    .insert(penghargaanData);

                if (penghargaanError) {
                    alert("Gagal menyimpan data penghargaan: " + penghargaanError.message);
                    return;
                }
            }

            // ==========================================
            // SINKRONISASI REFERENSI AKADEMIK (RESET & RE-INSERT)
            // ==========================================
            await adminSupabase
                .from("referensi_sastrawan")
                .delete()
                .eq("sastrawan_id", sastrawanId);

            const referensiData=[];

            document.querySelectorAll(".referensi-item").forEach(item=>{
                const penulis= item.querySelector(".referensi-penulis").value.trim();
                const judul= item.querySelector(".referensi-judul").value.trim();

                if(penulis===""|| judul==="") return;

                referensiData.push({
                    sastrawan_id:sastrawanId,
                    penulis,
                    judul,
                    penerbit: item.querySelector(".referensi-penerbit").value.trim(),
                    tahun: item.querySelector(".referensi-tahun").value|| null,
                    url: item.querySelector(".referensi-url").value.trim()
                });
            });

            if(referensiData.length>0){
                const { error: referensiError } = await adminSupabase
                    .from("referensi_sastrawan")
                    .insert(referensiData);

                if (referensiError) {
                    alert("Gagal menyimpan data referensi: " + referensiError.message);
                    return;
                }
            }

            // ==========================================
            // SINKRONISASI ARTIKEL TERKAIT
            // ==========================================
            await adminSupabase
                .from("artikel_sastrawan")
                .delete()
                .eq("sastrawan_id", sastrawanId);

            const artikelDipilih = document.querySelectorAll(".artikel-checkbox:checked");

            const artikelData = [...artikelDipilih].map(item=>({
                sastrawan_id: sastrawanId,
                artikel_id: item.value
            }));

            if(artikelData.length>0){
                const { error } = await adminSupabase
                    .from("artikel_sastrawan")
                    .insert(artikelData);

                if(error){
                    alert("Gagal menyimpan artikel terkait : " + error.message);
                    return;
                }
            }

            // ==========================================
            // SINKRONISASI RELASI KARYA
            // ==========================================
            // Hapus semua relasi karya lama untuk sastrawan ini (Reset data sebelum modifikasi)
            await adminSupabase
                .from("sastrawan_karya")
                .delete()
                .eq("sastrawan_id", sastrawanId);

            // Ambil semua kumpulan Checkbox karya yang sedang dicentang oleh user
            const checkedKarya = document.querySelectorAll(".karya-checkbox:checked");

            // Susun array objek data relasi baru
            const relasiData = [...checkedKarya].map(checkbox => ({
                sastrawan_id: sastrawanId,
                karya_id: checkbox.value
            }));

            // Jika ada karya yang dipilih, simpan relasi barunya ke database
            if (relasiData.length > 0) {
                const { error: relasiError } = await adminSupabase
                    .from("sastrawan_karya")
                    .insert(relasiData);

                if (relasiError) {
                    alert("Data sastrawan berhasil disimpan, tetapi gagal menautkan karya: " + relasiError.message);
                    return;
                }
            }

            alert("Data berhasil disimpan");
            location.href = "sastrawan.html";
        }
    );
}