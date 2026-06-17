// ======================================================
// FORM ARTIKEL
// Portal Sastra Indonesia
// ======================================================

let currentArtikelId = null;
let selectedIstilah = [];

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

        initSlugGenerator();

        await loadIstilah();

        await loadDataJikaEdit();

    }
);

// ======================================================
// AUTO SLUG
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
        .value.trim()
    };

    let result;

    try {

        if (currentArtikelId) {

            // Skenario Update Data
            result =
            await adminSupabase
                .from("artikel")
                .update(payload)
                .eq("id", currentArtikelId);

            if (result.error) throw result.error;

            // Simpan relasi menggunakan ID yang sedang diedit
            await simpanArtikelIstilah(currentArtikelId);

        } else {

            // Skenario Insert Data Baru
            payload.created_at =
            new Date()
            .toISOString();

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