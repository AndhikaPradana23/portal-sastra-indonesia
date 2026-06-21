// ======================================================
// FORM ISTILAH
// Portal Sastra Indonesia
// ======================================================

let currentIstilahId = null;
let referensiList = [];

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

        await loadKategori();

        initSlugGenerator();

        initReferensi();

        await loadIstilahTerkait();

        await loadSastrawan();

        await loadKarya();

        await loadDataJikaEdit();

    }
);

// ======================================================
// LOAD KATEGORI
// ======================================================

async function loadKategori() {

    const select =
    document.getElementById(
        "kategori_id"
    );

    const { data, error } =
    await adminSupabase
        .from("kategori")
        .select("*")
        .order("nama");

    if (error) {

        console.error(
            "Gagal memuat kategori:",
            error
        );

        return;
    }

    select.innerHTML =
        `<option value="">
            Pilih Kategori
        </option>`;

    data.forEach(item => {

        select.innerHTML += `

            <option value="${item.id}">
                ${item.nama}
            </option>

        `;

    });

}

// ======================================================
// SLUG GENERATOR
// ======================================================

function initSlugGenerator() {

    const namaInput =
    document.getElementById(
        "nama"
    );

    const slugInput =
    document.getElementById(
        "slug"
    );

    namaInput.addEventListener(
        "input",
        () => {

            slugInput.value =
            generateSlug(
                namaInput.value
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
// LOAD ISTILAH TERKAIT (CHECKBOX GENERATOR)
// ======================================================

async function loadIstilahTerkait() {

    const container =
        document.getElementById(
            "terkait-container"
        );

    const { data, error } =
        await adminSupabase
            .from("istilah")
            .select(`
                id,
                nama
            `)
            .order("nama");

    if (error) {

        console.error(error);

        container.innerHTML =
            "Gagal memuat istilah";

        return;
    }

    container.innerHTML =
        data.map(item => `
            <label class="checkbox-item" style="display: block; margin-bottom: 5px; cursor: pointer;">
                <input
                    type="checkbox"
                    class="terkait-checkbox"
                    value="${item.id}"
                >
                ${item.nama}
            </label>
        `).join("");

}

// ======================================================
// LOAD SASTRAWAN TERKAIT
// ======================================================

async function loadSastrawan(){

    const container =
    document.getElementById(
        "sastrawan-container"
    );

    const { data,error } =
    await adminSupabase
    .from("sastrawan")
    .select(`
        id,
        nama
    `)
    .order("nama");

    if(error){
        container.innerHTML =
        "Gagal memuat data";
        return;
    }

    container.innerHTML =
    data.map(item=>`
        <label style="display:block;margin-bottom:6px;">
            <input
                type="checkbox"
                class="sastrawan-checkbox"
                value="${item.id}"
            >
            ${item.nama}
        </label>
    `).join("");

}

// ======================================================
// LOAD KARYA TERKAIT
// ======================================================

async function loadKarya(){

    const container =
    document.getElementById(
        "karya-container"
    );

    const { data,error } =
    await adminSupabase
    .from("karya")
    .select(`
        id,
        judul
    `)
    .order("judul");

    if(error){
        container.innerHTML =
        "Gagal memuat karya";
        return;
    }

    container.innerHTML =
    data.map(item=>`
        <label style="display:block;margin-bottom:6px;">
            <input
                type="checkbox"
                class="karya-checkbox"
                value="${item.id}"
            >
            ${item.judul}
        </label>
    `).join("");

}

// ======================================================
// REFERENSI
// ======================================================

function initReferensi() {

    document
    .getElementById(
        "btn-tambah-referensi"
    )
    .addEventListener(
        "click",
        () => tambahReferensiInput()
    );

}

function tambahReferensiInput(value = "") {

    const container =
    document.getElementById(
        "referensi-container"
    );

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "referensi-item";

    wrapper.innerHTML = `
        <input
            type="text"
            class="referensi-input"
            placeholder="Masukkan referensi..."
            value="${value}"
        >
        <button
            type="button"
            class="hapus-referensi">
            Hapus
        </button>
    `;

    wrapper
    .querySelector(
        ".hapus-referensi"
    )
    .addEventListener(
        "click",
        () => wrapper.remove()
    );

    container.appendChild(
        wrapper
    );
}

async function loadReferensi() {

    if (!currentIstilahId)
        return;

    const { data, error } =
    await adminSupabase
        .from("referensi")
        .select("*")
        .eq(
            "istilah_id",
            currentIstilahId
        );

    if (error) {

        console.error(error);

        return;
    }

    const container =
    document.getElementById(
        "referensi-container"
    );

    container.innerHTML = "";

    data.forEach(item => {

        tambahReferensiInput(
            item.sumber
        );

    });
}

async function simpanReferensi(istilahId) {

    await adminSupabase
        .from("referensi")
        .delete()
        .eq(
            "istilah_id",
            istilahId
        );

    const referensiInputs =
    document.querySelectorAll(
        ".referensi-input"
    );

    const referensiBaru = [];

    referensiInputs.forEach(
        input => {

            const sumber =
            input.value.trim();

            if (sumber) {

                referensiBaru.push({
                    istilah_id: istilahId,
                    sumber
                });

            }

        }
    );

    if (referensiBaru.length === 0) return;

    const { error } =
    await adminSupabase
        .from("referensi")
        .insert(referensiBaru);

    if (error)
        throw error;
}

// ======================================================
// SIMPAN RELASI ISTILAH TERKAIT (MANY-TO-MANY)
// ======================================================

async function simpanIstilahTerkait(istilahId) {

    await adminSupabase
        .from("istilah_terkait")
        .delete()
        .eq("istilah_id", istilahId);

    const checked =
        document.querySelectorAll(
            ".terkait-checkbox:checked"
        );

    const relasi =
        [...checked].map(cb => ({
            istilah_id: istilahId,
            terkait_id: cb.value
        }));

    if (relasi.length === 0) {
        return;
    }

    const { error } =
        await adminSupabase
            .from("istilah_terkait")
            .insert(relasi);

    if (error) {
        console.error(error);
    }

}

// ======================================================
// SIMPAN RELASI SASTRAWAN TERKAIT
// ======================================================

async function simpanSastrawanTerkait(istilahId){

    await adminSupabase
    .from("istilah_sastrawan")
    .delete()
    .eq("istilah_id", istilahId);

    const checked =
    document.querySelectorAll(".sastrawan-checkbox:checked");

    if(!checked.length)
        return;

    const rows =
    [...checked].map(cb=>({
        istilah_id: istilahId,
        sastrawan_id: cb.value
    }));

    await adminSupabase
    .from("istilah_sastrawan")
    .insert(rows);

}

// ======================================================
// SIMPAN RELASI KARYA TERKAIT
// ======================================================

async function simpanKaryaTerkait(istilahId){

    await adminSupabase
    .from("istilah_karya")
    .delete()
    .eq("istilah_id", istilahId);

    const checked =
    document.querySelectorAll(".karya-checkbox:checked");

    if(!checked.length)
        return;

    const rows =
    [...checked].map(cb=>({
        istilah_id: istilahId,
        karya_id: cb.value
    }));

    await adminSupabase
    .from("istilah_karya")
    .insert(rows);

}

// ======================================================
// GET PARAMETER ID
// ======================================================

function getId() {

    const params =
    new URLSearchParams(
        window.location.search
    );

    return params.get("id");

}

// ======================================================
// LOAD DATA EDIT
// ======================================================

async function loadDataJikaEdit() {

    const id = getId();

    if (!id) return;

    currentIstilahId = id;

    document.getElementById(
        "judul-form"
    ).textContent =
    "Edit Istilah";

    document
    .getElementById(
        "metadata-section"
    )
    .style.display =
    "block";

    const { data, error } =
    await adminSupabase
        .from("istilah")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);

        alert(
            "Gagal memuat data istilah."
        );

        return;
    }

    document.getElementById("nama").value =
        data.nama || "";

    document.getElementById("slug").value =
        data.slug || "";

    document.getElementById("kategori_id").value =
        data.kategori_id || "";

    document.getElementById("tingkat").value =
        data.tingkat || "";

    document.getElementById("definisi").value =
        data.definisi || "";

    document.getElementById("penjelasan").value =
        data.penjelasan || "";

    document.getElementById("contoh").value =
        data.contoh || "";

    document
    .getElementById(
        "created-at"
    )
    .textContent =
    data.created_at
    ? new Date(
        data.created_at
    ).toLocaleString("id-ID")
    : "-";

    document
    .getElementById(
        "updated-at"
    )
    .textContent =
    data.updated_at
    ? new Date(
        data.updated_at
    ).toLocaleString("id-ID")
    : "-";

    await loadReferensi();

    // Memuat data relasi istilah terkait untuk dicentang otomatis
    const { data: relasi } =
    await adminSupabase
        .from("istilah_terkait")
        .select("terkait_id")
        .eq("istilah_id", currentIstilahId);

    if (relasi) {
        const selectedIds = relasi.map(item => item.terkait_id);

        document.querySelectorAll(".terkait-checkbox").forEach(cb => {
            cb.checked = selectedIds.includes(cb.value);
        });
    }

    // Muat relasi sastrawan
    const { data: relasiSastrawan } =
    await adminSupabase
    .from("istilah_sastrawan")
    .select("sastrawan_id")
    .eq("istilah_id", currentIstilahId);

    if(relasiSastrawan){
        const ids = relasiSastrawan.map(item=>item.sastrawan_id);
        document.querySelectorAll(".sastrawan-checkbox").forEach(cb=>{
            cb.checked = ids.includes(cb.value);
        });
    }

    // Muat relasi karya
    const { data: relasiKarya } =
    await adminSupabase
    .from("istilah_karya")
    .select("karya_id")
    .eq("istilah_id", currentIstilahId);

    if(relasiKarya){
        const ids = relasiKarya.map(item=>item.karya_id);
        document.querySelectorAll(".karya-checkbox").forEach(cb=>{
            cb.checked = ids.includes(cb.value);
        });
    }

    // Proteksi Keamanan: Menonaktifkan pilihan ke diri sendiri
    if (currentIstilahId) {
        const selfCheckbox = document.querySelector(`.terkait-checkbox[value="${currentIstilahId}"]`);
        if (selfCheckbox) {
            selfCheckbox.disabled = true;
            selfCheckbox.parentElement.style.opacity = ".5";
        }
    }

}

// ======================================================
// SUBMIT FORM
// ======================================================

document
.getElementById("istilah-form")
.addEventListener(
    "submit",
    simpanIstilah
);

// ======================================================
// VALIDASI
// ======================================================

function validasiForm() {

    const nama =
    document.getElementById(
        "nama"
    ).value.trim();

    const slug =
    document.getElementById(
        "slug"
    ).value.trim();

    const kategori =
    document.getElementById(
        "kategori_id"
    ).value;

    const definisi =
    document.getElementById(
        "definisi"
    ).value.trim();

    if (!nama) {

        alert(
            "Nama istilah wajib diisi."
        );

        return false;
    }

    if (!slug) {

        alert(
            "Slug wajib diisi."
        );

        return false;
    }

    if (!kategori) {

        alert(
            "Kategori wajib dipilih."
        );

        return false;
    }

    if (!definisi) {

        alert(
            "Definisi wajib diisi."
        );

        return false;
    }

    return true;

}

// ======================================================
// SIMPAN
// ======================================================

async function simpanIstilah(event) {

    event.preventDefault();

    if (!validasiForm())
        return;

    const submitBtn =
    event.target.querySelector(
        'button[type="submit"]'
    );

    submitBtn.disabled = true;
    submitBtn.textContent =
    "Menyimpan...";

    const payload = {

        nama:
        document.getElementById("nama")
        .value.trim(),

        slug:
        document.getElementById("slug")
        .value.trim(),

        kategori_id:
        document.getElementById("kategori_id")
        .value,

        tingkat:
        document.getElementById("tingkat")
        .value,

        definisi:
        document.getElementById("definisi")
        .value.trim(),

        penjelasan:
        document.getElementById("penjelasan")
        .value.trim(),

        contoh:
        document.getElementById("contoh")
        .value.trim()
    };

    let result;

    try {

        if (currentIstilahId) {

            payload.updated_at =
            new Date()
            .toISOString();

            result =
            await adminSupabase
                .from("istilah")
                .update(payload)
                .eq("id", currentIstilahId);

            if (result.error)
                throw result.error;

            await simpanReferensi(currentIstilahId);

            // Perbarui relasi jembatan istilah terkait
            await simpanIstilahTerkait(currentIstilahId);

            await simpanSastrawanTerkait(currentIstilahId);

            await simpanKaryaTerkait(currentIstilahId);

        } else {

            payload.created_at =
            new Date()
            .toISOString();

            payload.updated_at =
            new Date()
            .toISOString();

            result =
            await adminSupabase
                .from("istilah")
                .insert([payload])
                .select()
                .single();

            if (result.error)
                throw result.error;

            await simpanReferensi(result.data.id);

            // Simpan relasi jembatan menggunakan ID bentukan baru
            await simpanIstilahTerkait(result.data.id);

            await simpanSastrawanTerkait(result.data.id);

            await simpanKaryaTerkait(result.data.id);

        }

        alert(
            "Data berhasil disimpan."
        );

        location.href =
        "kamus-istilah.html";

    } catch(error) {

        console.error(error);

        alert(
            error.message
        );

    } finally {

        submitBtn.disabled =
        false;

        submitBtn.textContent =
        "Simpan";

    }

}