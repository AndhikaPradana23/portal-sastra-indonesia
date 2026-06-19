// ======================================================
// FORM ARTIKEL
// Portal Sastra Indonesia
// ======================================================

let currentArtikelId = null;
let selectedIstilah = [];

// DOM TAMBAHAN
const kategoriInput = document.getElementById("kategori");
const tagInput = document.getElementById("tag");
const thumbnailInput = document.getElementById("thumbnail");
const publishedInput = document.getElementById("published_at");

// DOM UNTUK UPLOAD & PREVIEW THUMBNAIL
const thumbnailFile = document.getElementById("thumbnail-file");
const preview = document.getElementById("thumbnail-preview");

// ======================================================
// INIT
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const { data } =
        await adminSupabase.auth.getSession();

        if (!data.session) {

            location.href =
            "login.html";

            return;
        }

        // Event listener saat file thumbnail dipilih
        thumbnailFile.addEventListener(
            "change",
            uploadThumbnail
        );

        initSlugGenerator();

        await loadIstilah();

        await loadDataJikaEdit();

    }
);

// ======================================================
// AUTO SLUG (SEO FRIENDLY)
// ======================================================

function initSlugGenerator() {

    const judulInput =
    document.getElementById(
        "judul"
    );

    const slugInput =
    document.getElementById(
        "slug"
    );

    judulInput.addEventListener(
        "input",
        () => {
            
            // Jika sedang mengedit artikel (ID tersedia), jangan ubah slug otomatis
            if (currentArtikelId) return;

            slugInput.value =
            generateSlug(
                judulInput.value
            );

        }
    );

}

function generateSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}

// ======================================================
// LOAD ISTILAH (CHECKBOX GENERATOR)
// ======================================================

async function loadIstilah() {

    const container =
    document.getElementById(
        "istilah-container"
    );

    const { data, error } =
    await adminSupabase
        .from("istilah")
        .select("id,nama")
        .order("nama");

    if (error) {

        container.innerHTML =
        "Gagal memuat istilah";

        return;
    }

    container.innerHTML =
    data.map(item => `
        <label class="checkbox-item" style="display: block; margin-bottom: 5px; cursor: pointer;">
            <input
                type="checkbox"
                value="${item.id}"
                class="istilah-checkbox"
            >
            ${item.nama}
        </label>
    `).join("");

}

// ======================================================
// GET ID
// ======================================================

function getId() {

    const params =
    new URLSearchParams(
        location.search
    );

    return params.get("id");

}

// ======================================================
// LOAD EDIT DATA
// ======================================================

async function loadDataJikaEdit() {

    const id =
    getId();

    if (!id)
        return;

    currentArtikelId =
    id;

    document.getElementById(
        "judul-form"
    ).textContent =
    "Edit Artikel";

    const { data, error } =
    await adminSupabase
        .from("artikel")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);

        alert(
            "Gagal memuat artikel."
        );

        return;
    }

    document.getElementById(
        "judul"
    ).value =
    data.judul || "";

    document.getElementById(
        "slug"
    ).value =
    data.slug || "";

    document.getElementById(
        "ringkasan"
    ).value =
    data.ringkasan || "";

    document.getElementById(
        "isi"
    ).value =
    data.isi || "";

    // Isi nilai seluruh komponen input tambahan saat edit berkas
    kategoriInput.value = data.kategori || "";

    tagInput.value = Array.isArray(data.tag)
        ? data.tag.join(", ")
        : "";

    thumbnailInput.value = data.thumbnail || "";

    publishedInput.value = data.published_at
        ? data.published_at.substring(0, 16)
        : "";

    // Tampilkan pratinjau gambar otomatis jika data thumbnail lama tersedia
    if (data.thumbnail) {
        preview.innerHTML = `
            <div class="thumbnail-preview" style="margin-top:20px;">
                <p><b>Thumbnail Saat Ini</b></p>
                <img
                    src="${data.thumbnail}"
                    style="
                        max-width:350px;
                        margin-top:10px;
                        border-radius:8px;
                        box-shadow:0 2px 8px rgba(0,0,0,.15);
                        display:block;
                    "
                >
                <p style="margin-top:10px; font-size:13px; word-break:break-all; color:#666;">
                    ${data.thumbnail}
                </p>
            </div>
        `;
    } else {
        preview.innerHTML = "";
    }

    // Ambil relasi istilah terkait dari tabel jembatan
    const { data: relasi } =
    await adminSupabase
        .from("artikel_istilah")
        .select("istilah_id")
        .eq("artikel_id", id);

    if (relasi) {
        
        const selectedIds =
        relasi.map(
            item =>
            item.istilah_id
        );

        // Centang otomatis checkbox yang sesuai dengan data di database
        document
        .querySelectorAll(".istilah-checkbox")
        .forEach(cb => {

            cb.checked =
            selectedIds.includes(
                cb.value
            );

        });
    }

}

// ======================================================
// HELPER GENERATE NAMA FILE (DENGAN STRUKTUR FOLDER)
// ======================================================

function generateFileName(file) {

    const judul =
    document
    .getElementById("judul")
    .value
    .trim();

    const slug =
    generateSlug(
        judul || "artikel"
    );

    const sekarang =
    new Date();

    const tahun =
    sekarang.getFullYear();

    const bulan =
    String(
        sekarang.getMonth() + 1
    ).padStart(
        2,
        "0"
    );

    const ext =
    file.name
    .split(".")
    .pop()
    .toLowerCase();

    return {
        path: `${tahun}/${bulan}/${slug}.${ext}`,
        slug
    };

}

// ======================================================
// HELPER HAPUS THUMBNAIL LAMA DARI STORAGE
// ======================================================

async function deleteOldThumbnail() {

    if (!thumbnailInput.value)
        return;

    try {

        const url =
        new URL(
            thumbnailInput.value
        );

        const marker =
        "/artikel/";

        const index =
        url.pathname.indexOf(
            marker
        );

        if (index === -1)
            return;

        const filePath =
        url.pathname.substring(
            index +
            marker.length
        );

        await adminSupabase
        .storage
        .from("artikel")
        .remove([
            filePath
        ]);

    }

    catch (e) {
        console.log(e);
    }

}

// ======================================================
// FUNGSI UPLOAD THUMBNAIL (SUPABASE STORAGE)
// ======================================================

async function uploadThumbnail() {

    const file = thumbnailFile.files[0];

    if (!file) return;

    // Bersihkan file lama sebelum mengunggah file baru ke Storage bucket
    await deleteOldThumbnail();

    // Dapatkan path terstruktur menggunakan helper baru
    const hasil = generateFileName(file);
    const namaFile = hasil.path;

    const { error } = await adminSupabase
        .storage
        .from("artikel")
        .upload(
            namaFile,
            file,
            {
                upsert: true
            }
        );

    if (error) {
        alert(error.message);
        return;
    }

    const { data } = adminSupabase
        .storage
        .from("artikel")
        .getPublicUrl(namaFile);

    thumbnailInput.value = data.publicUrl;

    // Tampilkan preview dengan tampilan baru yang profesional
    preview.innerHTML = `
        <div class="thumbnail-preview" style="margin-top:20px;">
            <p><b>Preview Thumbnail</b></p>
            <img
                src="${data.publicUrl}"
                style="
                    max-width:350px;
                    border-radius:8px;
                    box-shadow:0 4px 12px rgba(0,0,0,.15);
                    display:block;
                    margin-top:10px;
                "
            >
            <p style="margin-top:10px; font-size:13px; word-break:break-all; color:#666;">
                ${data.publicUrl}
            </p>
        </div>
    `;

}

// ======================================================
// SIMPAN RELASI ARTIKEL ISTILAH (MANY-TO-MANY)
// ======================================================

async function simpanArtikelIstilah(artikelId) {

    // Bersihkan relasi lama terlebih dahulu
    await adminSupabase
        .from("artikel_istilah")
        .delete()
        .eq("artikel_id", artikelId);

    const checked =
    document.querySelectorAll(
        ".istilah-checkbox:checked"
    );

    const relasi =
    [...checked].map(
        item => ({
            artikel_id: artikelId,
            istilah_id: item.value
        })
    );

    if (!relasi.length)
        return;

    // Masukkan kombinasi relasi baru
    await adminSupabase
        .from("artikel_istilah")
        .insert(relasi);

}

// ======================================================
// SUBMIT FORM
// ======================================================

document
.getElementById("artikel-form")
.addEventListener(
    "submit",
    simpanArtikel
);

// ======================================================
// SIMPAN (INSERT / UPDATE)
// ======================================================

async function simpanArtikel(event) {

    event.preventDefault();

    const submitBtn =
    event.target.querySelector(
        'button[type="submit"]'
    );

    submitBtn.disabled = true;
    submitBtn.textContent =
    "Menyimpan...";

    // Struktur payload lengkap sesuai modifikasi instruksi
    const payload = {
        judul:
        document.getElementById("judul")
        .value.trim(),

        slug:
        document.getElementById("slug")
        .value.trim(),

        ringkasan:
        document.getElementById("ringkasan")
        .value.trim(),

        isi:
        document.getElementById("isi")
        .value.trim(),

        kategori:
        kategoriInput.value,

        tag:
        tagInput.value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== ""),

        thumbnail:
        thumbnailInput.value.trim(),

        published_at:
        publishedInput.value
        ? new Date(
        publishedInput.value
        ).toISOString()
        : null,

        updated_at:
        new Date()
        .toISOString()
    };

    let result;

    try {

        if (currentArtikelId) {

            // Skenario Update Data (Hanya memperbarui updated_at, tanpa menyentuh created_at)
            result =
            await adminSupabase
                .from("artikel")
                .update(payload)
                .eq("id", currentArtikelId);

            if (result.error) throw result.error;

            // Simpan relasi menggunakan ID yang sedang diedit
            await simpanArtikelIstilah(currentArtikelId);

        } else {

            // Skenario Insert Data Baru dengan logika fallback pencatatan waktu pembuatan data
            payload.created_at = new Date().toISOString();

            if (!payload.published_at) {
                payload.published_at = payload.created_at;
            }

            result =
            await adminSupabase
                .from("artikel")
                .insert([payload])
                .select()
                .single();

            if (result.error) throw result.error;

            // Simpan relasi menggunakan ID baru yang digenerate oleh Supabase
            await simpanArtikelIstilah(result.data.id);

        }

        alert(
            "Artikel berhasil disimpan."
        );

        location.href =
        "artikel.html";

    } catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan data: " + error.message
        );

    } finally {

        submitBtn.disabled =
        false;

        submitBtn.textContent =
        "Simpan";

    }
}