// ==========================================================================
// HELPER DETAIL BOOKMARK (REFACTOR)
// ==========================================================================
/**
 * Helper global untuk menginisialisasi tombol bookmark di semua halaman detail.
 * @param {string} tipe - Kategori tipe konten ('istilah', 'artikel', 'karya', 'sastrawan')
 * @param {Object} data - Objek data mentah dari database Supabase
 */
function initDetailBookmark(tipe, data){

    if(
        typeof initBookmarkButton !==
        "function"
    ){
        return;
    }

    return initBookmarkButton(
        createBookmarkItem({
            tipe: "istilah",
            item_id: data.id,
            judul: data.nama || data.judul,
            slug: data.slug
        })
    );

}

// ==========================================================================
// CORE DETAIL FUNCTION
// ==========================================================================
async function loadDetailIstilah() {

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("detail-istilah");

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const slug =
            params.get("slug");

        if (!slug) {

            loading.style.display = "none";

            container.innerHTML = `
                <div class="error">
                    <h2>Istilah tidak ditemukan</h2>
                </div>
            `;

            return;
        }

        // ==================================================
        // MEMUAT DATA UTAMA ISTILAH DARI SUPABASE
        // ==================================================
        const { data, error } =
            await supabaseClient
                .from("istilah")
                .select("*")
                .eq("slug", slug)
                .single();

        if (error) {
            throw error;
        }

        // ==========================================
        // RENDER BREADCRUMB DINAMIS
        // ==========================================
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/index.html"
            },
            {
                label: "Kamus Sastra",
                href: "/kamus-istilah/index.html"
            },
            {
                label: data.nama
            }
        ]);

        /*
        =========================
        SIMPAN RIWAYAT PENCARIAN
        =========================
        */
        let history =
            JSON.parse(
                localStorage.getItem(
                    "kamusHistory"
                )
            ) || [];

        // Hapus entri lama dengan slug yang sama agar tidak duplikat
        history =
            history.filter(
                item =>
                    item.slug !== data.slug
            );

        // Tambahkan istilah yang baru dibuka ke urutan paling atas (awal array)
        history.unshift({
            nama: data.nama,
            slug: data.slug
        });

        // Batasi riwayat maksimal hanya menyimpan 10 item terakhir
        history =
            history.slice(0, 10);

        // Simpan kembali array riwayat ke localStorage pembaca browser
        localStorage.setItem(
            "kamusHistory",
            JSON.stringify(history)
        );


        // ==========================================
        // MEMUAT DATA REFERENSI DAN DATA TERKAIT
        // ==========================================
        const {
            data: referensiData,
            error: referensiError
        } =
            await supabaseClient
                .from("referensi")
                .select("*")
                .eq("istilah_id", data.id);

        if (referensiError) {
            console.error(referensiError);
        }

        /*
        =========================
        AMBIL RELASI ISTILAH TERKAIT
        =========================
        */
        const {
            data: relasiData,
            error: relasiError
        } =
            await supabaseClient
                .from("istilah_terkait")
                .select("*")
                .eq("istilah_id", data.id);

        if (relasiError) {
            console.error(relasiError);
        }

        /*
        =========================
        AMBIL DATA ISTILAH TERKAIT
        =========================
        */
        let istilahTerkait = [];

        if (
            relasiData &&
            relasiData.length > 0
        ) {

            const relatedIds =
                relasiData.map(
                    item => item.terkait_id
                );

            const {
                data: relatedData,
                error: relatedError
            } =
                await supabaseClient
                    .from("istilah")
                    .select(`
                        id,
                        nama,
                        slug
                    `)
                    .in(
                        "id",
                        relatedIds
                    );

            if (relatedError) {
                console.error(relatedError);
            } else {
                istilahTerkait = relatedData || [];
            }
        }

        /*
        ================================================
        AMBIL ARTIKEL TERKAIT (LANGKAH 5 & LANGKAH 6)
        ================================================
        */
        const { data: artikelRelasi, error: artikelRelasiError } = 
            await supabaseClient
                .from("artikel_istilah")
                .select("*")
                .eq("istilah_id", data.id);

        if (artikelRelasiError) {
            console.error(artikelRelasiError);
        }

        let artikelTerkait = [];
        if (artikelRelasi && artikelRelasi.length > 0) {
            const artikelIds = artikelRelasi.map(item => item.artikel_id);

            const { data: artikelData, error: artikelDataError } = 
                await supabaseClient
                    .from("artikel")
                    .select(`
                        id,
                        judul,
                        slug
                    `)
                    .in("id", artikelIds);

            if (artikelDataError) {
                console.error(artikelDataError);
            } else {
                artikelTerkait = artikelData || [];
            }
        }

        // ==========================================
        // AMBIL SASTRAWAN TERKAIT
        // ==========================================
        const {
            data: sastrawanRelasi,
            error: sastrawanRelasiError
        } =
        await supabaseClient
        .from("istilah_sastrawan")
        .select(`
            sastrawan(
                id,
                nama,
                slug
            )
        `)
        .eq(
            "istilah_id",
            data.id
        );

        if(sastrawanRelasiError){
            console.error(
                sastrawanRelasiError
            );
        }

        // ==========================================
        // AMBIL KARYA TERKAIT
        // ==========================================
        const {
            data: karyaRelasi,
            error: karyaRelasiError
        } =
        await supabaseClient
        .from("istilah_karya")
        .select(`
            karya(
                id,
                judul,
                slug
            )
        `)
        .eq(
            "istilah_id",
            data.id
        );

        if(karyaRelasiError){
            console.error(
                karyaRelasiError
            );
        }

        loading.style.display = "none";

        let referensiHTML = "";

        if (
            referensiData &&
            referensiData.length > 0
        ) {

            referensiHTML = `
                <section class="section">

                    <h2>Referensi</h2>

                    <ul class="referensi-list">

                        ${referensiData.map(item => `
                            <li>
                                ${item.sumber}
                            </li>
                        `).join("")}

                    </ul>

                </section>
            `;
        }

        /*
        =========================
        TAMBAHKAN HTML ISTILAH TERKAIT
        =========================
        */
        let terkaitHTML = "";

        if (
            istilahTerkait &&
            istilahTerkait.length > 0
        ) {

            terkaitHTML = `
                <section class="section">

                    <h2>Istilah Terkait</h2>

                    <ul class="terkait-list">

                        ${istilahTerkait.map(item => `
                            <li>
                                <a href="detail.html?slug=${item.slug}">
                                    ${item.nama}
                                </a>
                            </li>
                        `).join("")}

                    </ul>

                </section>
            `;
        }

        // ==========================================
        // SASTRAWAN TERKAIT
        // ==========================================
        let sastrawanHTML = "";

        if(
            sastrawanRelasi &&
            sastrawanRelasi.length
        ){

            sastrawanHTML = `
                <section class="section">
                    <h2>Sastrawan yang Menggunakan Istilah</h2>
                    <ul>
                        ${sastrawanRelasi.map(item=>`
                            <li>
                                <a href="../sastrawan/detail.html?slug=${item.sastrawan.slug}">
                                    ${item.sastrawan.nama}
                                </a>
                            </li>
                        `).join("")}
                    </ul>
                </section>
            `;

        }

        // ==========================================
        // KARYA TERKAIT
        // ==========================================
        let karyaHTML = "";

        if(
            karyaRelasi &&
            karyaRelasi.length
        ){

            karyaHTML = `
                <section class="section">
                    <h2>Karya Sastra yang Menggunakan Istilah</h2>
                    <ul>
                        ${karyaRelasi.map(item=>`
                            <li>
                                <a href="../karya-sastra/detail.html?slug=${item.karya.slug}">
                                    ${item.karya.judul}
                                </a>
                            </li>
                        `).join("")}
                    </ul>
                </section>
            `;

        }

        /*
        ========================================
        ARTIKEL TERKAIT (TAMPILAN GRID KARTU)
        ========================================
        */
        let artikelHTML = "";

        if (
            artikelTerkait &&
            artikelTerkait.length > 0
        ) {

            artikelHTML = `
                <section class="section">

                    <h2>Artikel Terkait</h2>

                    <div class="artikel-grid">

                        ${artikelTerkait.map(item => `

                            <article class="artikel-card">

                                <a
                                    href="../artikel/detail.html?slug=${item.slug}"
                                    class="artikel-link"
                                >
                                    ${item.judul}
                                </a>

                            </article>

                        `).join("")}

                    </div>

                </section>
            `;
        }

        // ==================================================================
        // RENDER HTML UTAMA (Sintaks liar 'academic' kini sudah dibersihkan!)
        // ==================================================================
        container.innerHTML = `
            <article class="detail-card">

                <header>

                    <h1>
                        ${data.nama}
                    </h1>

                    <div class="meta">

                        <span class="badge-tingkat">
                            ${data.tingkat || "-"}
                        </span>

                    </div>

                    <button id="bookmark-button" class="bookmark-btn">
                        ☆ Simpan
                    </button>

                </header>

                <section class="section">

                    <h2>Definisi</h2>

                    <p>
                        ${data.definisi || "-"}
                    </p>

                </section>

                <section class="section">

                    <h2>Penjelasan Lengkap</h2>

                    <p>
                        ${data.penjelasan || "-"}
                    </p>

                </section>

                <section class="section">

                    <h2>Contoh</h2>

                    <p>
                        ${data.contoh || "-"}
                    </p>

                </section>

                ${referensiHTML}

                ${terkaitHTML}

                ${sastrawanHTML}

                ${karyaHTML}

                ${artikelHTML}

            </article>
        `;

        // ==================================================================
        // INISIALISASI TOMBOL BOOKMARK AMAN (Dipanggil SETELAH HTML masuk DOM)
        // ==================================================================
        await initDetailBookmark(
            "istilah",
            data
        );

    } catch (error) {

        loading.style.display = "none";

        console.error(error);

        container.innerHTML = `
            <div class="error">

                <h2>
                    Gagal memuat istilah
                </h2> 

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
}

// ==========================================
// FUNGSIONALITAS BOOKMARK ISTILAH KAMUS (LAMA - CADANGAN)
// ==========================================
document.addEventListener(
    "click",
    function(event) {
        if (
            event.target.id ===
            "bookmark-btn"
        ) {

            const nama =
                event.target.dataset.nama;

            const slug =
                event.target.dataset.slug;

            let bookmarks =
                JSON.parse(
                    localStorage.getItem(
                        "deliciousKamusBookmarks"
                    )
                ) || JSON.parse(localStorage.getItem("kamusBookmarks")) || [];

            const sudahAda =
                bookmarks.some(
                    item =>
                        item.slug === slug
                );

            if (!sudahAda) {

                bookmarks.push({
                    nama,
                    slug
                });

                localStorage.setItem(
                    "kamusBookmarks",
                    JSON.stringify(
                        bookmarks
                    )
                );

                alert(
                    "Istilah berhasil disimpan."
                );

            } else {

                alert(
                    "Istilah sudah ada di bookmark."
                );
            }
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    loadDetailIstilah
);