document.addEventListener(
    "DOMContentLoaded",
    initPage
);

async function initPage(){

    await loadLayout();

    // Memanggil breadcrumb untuk halaman generator sitasi
    renderBreadcrumb([
        {
            label: "Beranda",
            href: "/",
            icon: "/assets/icons/house.svg"
        },
        {
            label: "Generator Sitasi",
            icon: "/assets/icons/quote.svg" // Atau ikon lain yang sesuai dengan aset Anda
        }
    ]);

    initForm();

    // UPDATE: Menampilkan riwayat sitasi saat halaman pertama kali dimuat
    renderHistory();

    // UPDATE: Memperbarui skema JSON-LD untuk SEO saat halaman dimuat
    updateCitationSchema();

    // LANGKAH 6: Auto Fill dari Session Storage
    loadDraftCitation();

    // UPDATE: Menambahkan event listener untuk menyalin sitasi
    document
        .getElementById(
            "copy-citation"
        )
        .addEventListener(
            "click",
            copyCitation
        );

    // UPDATE: Menambahkan event listener untuk mengunduh sitasi
    document
        .getElementById(
            "download-citation"
        )
        .addEventListener(
            "click",
            downloadCitation
        );

}

function initForm(){

    const form =
        document.getElementById(
            "citation-form"
        );

    form.addEventListener(
        "submit",
        handleGenerate
    );

}

function handleGenerate(
    event
){

    event.preventDefault();

    const data = {

        author:
            document
            .getElementById("author")
            .value,

        title:
            document
            .getElementById("title")
            .value,

        year:
            document
            .getElementById("year")
            .value,

        publisher:
            document
            .getElementById("publisher")
            .value,

        url:
            document
            .getElementById("url")
            .value,

        style:
            document
            .getElementById("style")
            .value

    };

    const citation =
        generateCitation(
            data
        );

    // UPDATE: Menyimpan ke riwayat dan memperbarui tampilan daftar riwayat
    saveCitationHistory(
        citation
    );

    renderHistory();

    // UPDATE: Memperbarui skema JSON-LD dengan data sitasi terbaru setelah dibuat
    updateCitationSchema();

    document
        .getElementById(
            "citation-result"
        )
        .textContent =
        citation;

}

// UPDATE: Fungsi baru untuk merender daftar riwayat sitasi ke HTML
function renderHistory(){

    const container =
        document
        .getElementById(
            "citation-history"
        );

    const history =
        getCitationHistory();

    if(
        !history.length
    ){

        container.innerHTML =
        `
        <div class="empty-state">
            <img
                src="/assets/icons/history.svg"
                class="empty-state-icon"
                alt="">
            <h3>Belum Ada Riwayat</h3>
            <p>Sitasi yang Anda buat akan tersimpan di sini.</p>
        </div>
        `;

        return;
    }

    container.innerHTML =
        history
        .map(item=>`

            <article
                class="
                history-card
                "
            >

                <div class="history-top">
                    <img
                        src="/assets/icons/quote.svg"
                        class="history-icon"
                        alt="">
                    <span>Hasil Sitasi</span>
                </div>
                <p class="history-text">${item}</p>

            </article>

        `)
        .join("");

}

// ==========================================================================
// LANGKAH 6: AUTO FILL GENERATOR DRAFT FUNCTIONS
// ==========================================================================
function loadDraftCitation(){

    const raw =
        sessionStorage.getItem(
            "citationDraft"
        );

    if(!raw){
        return;
    }

    const data =
        JSON.parse(raw);

    document
        .getElementById(
            "author"
        )
        .value =
        data.author || "";

    document
        .getElementById(
            "title"
        )
        .value =
        data.title || "";

    document
        .getElementById(
            "year"
        )
        .value =
        data.year || "";

    document
        .getElementById(
            "publisher"
        )
        .value =
        data.publisher || "";

    document
        .getElementById(
            "url"
        )
        .value =
        data.url || "";

}