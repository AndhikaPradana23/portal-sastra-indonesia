// ==========================================================================
// HELPER: SANITASI TEXT (XSS PROTECTION)
// ==========================================================================
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================================================
// LANGKAH 2: HELPER URL PENCARIAN
// ==========================================================================
function getSearchUrl(
    tipe,
    slug
){

    switch(tipe){

        case "istilah":
            return `/kamus-istilah/detail.html?slug=${slug}`;

        case "artikel":
            return `/artikel/detail.html?slug=${slug}`;

        case "sastrawan":
            return `/sastrawan/detail.html?slug=${slug}`;

        case "karya":
            return `/karya-sastra/detail.html?slug=${slug}`;

        default:
            return "#";
    }

}

// ==========================================================================
// LANGKAH 1: RENDERER AUTOCOMPLETE ITEM
// ==========================================================================
function renderAutocompleteItem(
    tipe,
    item
){

    let icon = "🔎";
    let title = "";

    switch(tipe){

        case "istilah":
            icon = "📖";
            title = item.nama;
            break;

        case "artikel":
            icon = "📰";
            title = item.judul;
            break;

        case "sastrawan":
            icon = "👤";
            title = item.nama;
            break;

        case "karya":
            icon = "📚";
            title = item.judul;
            break;

    }

    return `
        <a
            href="${getSearchUrl(
                tipe,
                item.slug
            )}"
            class="autocomplete-item"
        >

            <span>
                ${icon}
            </span>

            <span>
                ${escapeHtml(title)}
            </span>

        </a>
    `;

}

// ==========================================================================
// EXPORT GLOBAL OBJECTS
// ==========================================================================
window.getSearchUrl = getSearchUrl;
window.renderAutocompleteItem = renderAutocompleteItem;