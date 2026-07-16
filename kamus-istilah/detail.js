// ======================================================
// BOOKMARK
// ======================================================
function initDetailBookmark(data){

    if(
        typeof initBookmarkButton !== "function"
    ){
        return;
    }

    initBookmarkButton(

        createBookmarkItem({

            tipe:"istilah",

            item_id:data.id,

            judul:data.nama,

            slug:data.slug

        })

    );

}

// ==========================================================================
// CORE DETAIL FUNCTION
// ==========================================================================
async function loadDetailIstilah() {

    const container =
        document.getElementById("detail-istilah");

    const loading =
        document.getElementById("loading");

    const toolbar =
        container.querySelector(".detail-toolbar");

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const slug =
            params.get("slug");

        if (!slug) {

            loading.outerHTML = `
                <div class="empty-state">
                    <img
                        src="/assets/icons/book-open.svg"
                        class="empty-icon"
                        alt="">
                    <h3>
                        Istilah tidak ditemukan
                    </h3>
                    <p>
                        Silakan kembali ke halaman kamus.
                    </p>
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
        // RENDER BREADCRUMB DINAMIS (UPDATED)
        // ==========================================
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Kamus",
                href: "/kamus/",
                icon: "/assets/icons/book-open.svg"
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

        let referensiHTML = "";

        if (
            referensiData &&
            referensiData.length > 0
        ) {

            referensiHTML = `
                <section class="section">

                    <h2><img src="/assets/icons/library.svg" class="heading-icon" alt=""> Referensi</h2>

                    <div class="tag-list">
                        ${referensiData.map(item => `
                            <span class="tag-link">
                                <img src="/assets/icons/library.svg" class="tag-icon" alt="">${item.sumber}
                            </span>
                        `).join("")}
                    </div>

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

                    <h2><img src="/assets/icons/link.svg" class="heading-icon" alt=""> Istilah Terkait</h2>

                    <div class="tag-list">
                        ${istilahTerkait.map(item => `
                            <a href="detail.html?slug=${item.slug}" class="tag-link">
                                <img src="/assets/icons/link.svg" class="tag-icon" alt="">${item.nama}
                            </a>
                        `).join("")}
                    </div>

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
                    <h2><img src="/assets/icons/users.svg" class="heading-icon" alt=""> Sastrawan yang Menggunakan Istilah</h2>
                    <div class="tag-list">
                        ${sastrawanRelasi.map(item=>`
                            <a href="../sastrawan/detail.html?slug=${item.sastrawan.slug}" class="tag-link">
                                <img src="/assets/icons/users.svg" class="tag-icon" alt="">${item.sastrawan.nama}
                            </a>
                        `).join("")}
                    </div>
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
                    <h2><img src="/assets/icons/book-copy.svg" class="heading-icon" alt=""> Karya Sastra yang Menggunakan Istilah</h2>
                    <div class="tag-list">
                        ${karyaRelasi.map(item=>`
                            <a href="../karya-sastra/detail.html?slug=${item.karya.slug}" class="tag-link">
                                <img src="/assets/icons/book-copy.svg" class="tag-icon" alt="">${item.karya.judul}
                            </a>
                        `).join("")}
                    </div>
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

                    <h2><img src="/assets/icons/newspaper.svg" class="heading-icon" alt=""> Artikel Terkait</h2>

                    <div class="tag-list">
                        ${artikelTerkait.map(item => `
                            <a href="../artikel/detail.html?slug=${item.slug}" class="tag-link">
                                <img src="/assets/icons/newspaper.svg" class="tag-icon" alt="">${item.judul}
                            </a>
                        `).join("")}
                    </div>

                </section>
            `;
        }

        // ==================================================================
        // RENDER HTML UTAMA (MENGGANTI LOADING TANPA MENGHAPUS TOOLBAR)
        // ==================================================================
        loading.outerHTML = `
            <article class="detail-card fade-up">

                <header class="detail-header">

                    <div class="detail-title">

                        <img
                            src="/assets/icons/book-open.svg"
                            class="detail-icon"
                            alt=""
                        >

                        <div>

                            <h1>${data.nama}</h1>

                            <div class="meta">

                                <span class="badge-tingkat">
                                    ${data.tingkat || "-"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div class="detail-actions">

                        <button
                            id="bookmark-button"
                            class="btn btn-outline"
                        >

                            <img
                                src="/assets/icons/bookmark.svg"
                                class="btn-icon"
                                alt=""
                            >

                            Simpan

                        </button>

                    </div>

                </header>

                <section class="section">

                    <h2>

                        <img
                            src="/assets/icons/file-text.svg"
                            class="heading-icon"
                            alt="">

                        Definisi

                    </h2>

                    <p>
                        ${data.definisi || "-"}
                    </p>

                </section>

                <section class="section">

                    <h2>

                        <img
                            src="/assets/icons/file-text.svg"
                            class="heading-icon"
                            alt="">

                        Penjelasan Lengkap

                    </h2>

                    <p>
                        ${data.penjelasan || "-"}
                    </p>

                </section>

                <section class="section">

                    <h2>

                        <img
                            src="/assets/icons/pen-tool.svg"
                            class="heading-icon"
                            alt="">

                        Contoh

                    </h2>

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
        // INISIALISASI TOMBOL SITASI DAN BOOKMARK AMAN
        // ==================================================================
        initDetailBookmark(data);
        initCitationButton(data);

    } catch (error) {

        console.error(error);

        loading.outerHTML = `
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

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await loadLayout();

        await loadDetailIstilah();

    }

);

// ==========================================
// FUNGSIONALITAS TOMBOL SITASI ISTILAH KAMUS
// ==========================================
function initCitationButton(
    istilah
){

    const button =
        document.getElementById(
            "citation-btn"
        );

    if(!button){
        return;
    }

    button.onclick = () => {

        openCitationPage({

            author:
                "Portal Sastra Indonesia",

            title:
                istilah.nama,

            year:
                new Date()
                .getFullYear(),

            publisher:
                "Portal Sastra Indonesia",

            url:
                window.location.href

        });

    };

}