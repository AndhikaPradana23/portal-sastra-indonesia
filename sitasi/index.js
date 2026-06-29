document.addEventListener(
    "DOMContentLoaded",
    initPage
);

async function initPage(){

    await loadLayout();

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
        <p>
            Belum ada riwayat.
        </p>
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

                <pre>
${item}
                </pre>

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