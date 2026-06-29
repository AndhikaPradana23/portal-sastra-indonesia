// ==========================================================================
// AUTOCOMPLETE ENGINE UTILITIES
// ==========================================================================
function highlightAutocomplete(
    text,
    keyword
){

    if(
        !text ||
        !keyword
    ){
        return text;
    }

    const escaped =
        keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const regex =
        new RegExp(
            `(${escaped})`,
            "gi"
        );

    return text.replace(
        regex,
        "<mark>$1</mark>"
    );
}

// ==========================================================================
// AUTOCOMPLETE ENGINE (CORE)
// ==========================================================================
async function renderAutocomplete(
    keyword,
    container
){

    keyword =
        keyword.trim();

    if(!keyword){
        container.innerHTML = "";
        container.style.display = "none";
        return;
    }

    const result =
        await SearchService
            .globalSearch(
                keyword
            );

    let html = "";

    Object.entries(result)
        .forEach(
            ([tipe, items])=>{

                items.forEach(item=>{

                    // LANGKAH 4: Mengalirkan keyword ke fungsi renderer item
                    html +=
                        renderAutocompleteItem(
                            tipe,
                            item,
                            keyword
                        );

                });

            }
        );

    if(!html){
        html = `
            <div
                class="autocomplete-empty"
            >
                Tidak ada hasil.
            </div>
        `;
    }

    container.innerHTML =
        html;

    container.style.display =
        "block";

}

// ==========================================================================
// ITEM RENDERER HELPER
// ==========================================================================
function renderAutocompleteItem(tipe, item, keyword) {
    // Menentukan properti text berdasarkan tipe data (nama / judul)
    const labelText = item.nama || item.judul || "";
    const urlMapping = {
        istilah: "/kamus-istilah/detail.html?slug=",
        sastrawan: "/sastrawan/detail.html?slug=",
        karya: "/karya-sastra/detail.html?slug=",
        artikel: "/artikel/detail.html?slug="
    };
    
    const baseUrl = urlMapping[tipe] || "/detail.html?slug=";

    // LANGKAH 4: Menggunakan highlightAutocomplete() untuk menyorot kata kunci pada label autocomplete
    return `
        <a 
            class="autocomplete-item" 
            href="${baseUrl}${item.slug}"
            data-keyword="${escapeHtml(labelText)}"
        >
            <span class="autocomplete-label">
                ${highlightAutocomplete(labelText, keyword)}
            </span>
            <span class="autocomplete-type">
                (${tipe})
            </span>
        </a>
    `;
}

// ==========================================================================
// INITIALIZATION & EVENT LISTENERS MANAGEMENTS
// ==========================================================================
function initAutocomplete({
    input,
    result
}){

    // MENAMBAHKAN LOG UNTUK MEMASTIKAN FUNGSI INI DIJALANKAN
    console.log(
        "Autocomplete initialized"
    );

    const searchInput =
        document.querySelector(
            input
        );

    // MENAMBAHKAN LOG UNTUK MEMERIKSA ELEMEN DOM INPUT YANG BERHASIL DIAMBEL
    console.log(
        searchInput
    );

    const resultBox =
        document.querySelector(
            result
        );

    if(
        !searchInput ||
        !resultBox
    ){
        return;
    }

    // Event listener saat pengguna mengetik kata kunci pencarian
    searchInput.addEventListener(
        "input",
        async ()=>{

            await renderAutocomplete(
                searchInput.value,
                resultBox
            );

        }
    );

    // Event listener untuk menutup kotak autocomplete jika klik di luar area pencarian
    document.addEventListener(
        "click",
        event=>{

            if(
                !resultBox.contains(
                    event.target
                ) &&
                event.target !== searchInput
            ){

                resultBox.style.display =
                    "none";

            }

        }
    );

}

// ==========================================================================
// EXPORT GLOBAL OBJECT
// ==========================================================================
window.initAutocomplete = initAutocomplete;