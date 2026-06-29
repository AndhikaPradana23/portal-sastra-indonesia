// ==========================================
// PORTAL SASTRA INDONESIA - SEARCH SEO ENGINE
// ==========================================

/**
 * LANGKAH 1: Fungsi Utama Update Search SEO
 */
function updateSearchSEO(keyword, total = 0) {
    const title = keyword
        ? `Hasil Pencarian "${keyword}" | Portal Sastra Indonesia`
        : "Global Search | Portal Sastra Indonesia";

    document.title = title;

    const description = keyword
        ? `Menampilkan ${total} hasil pencarian untuk "${keyword}" pada Portal Sastra Indonesia, termasuk istilah sastra, sastrawan, karya sastra, dan artikel terkait.`
        : "Cari istilah sastra, artikel, karya sastra, dan sastrawan di Portal Sastra Indonesia.";

    updateMeta("description", description);
    updateOg("og:title", title);
    updateOg("og:description", description);
    updateCanonical(keyword);
    renderSearchSchema(keyword, total);
}

/**
 * LANGKAH 2: Helper Standard Meta Tag
 */
function updateMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);

    if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.append(meta);
    }

    meta.content = content;
}

/**
 * LANGKAH 3: Helper Open Graph (OG) Tag
 */
function updateOg(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);

    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.append(meta);
    }

    meta.content = content;
}

/**
 * LANGKAH 4: Helper Canonical URL Tag
 */
function updateCanonical(keyword) {
    let link = document.querySelector('link[rel="canonical"]');

    if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.append(link);
    }

    const url = keyword
        ? `${window.location.origin}/search/index.html?q=${encodeURIComponent(keyword)}`
        : `${window.location.origin}/search/index.html`;

    link.href = url;
}

/**
 * LANGKAH 5: Render Terstruktur Schema SearchResultsPage
 */
function renderSearchSchema(keyword, total) {
    const old = document.getElementById("search-schema");

    if (old) {
        old.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "search-schema";

    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "name": `Hasil pencarian ${keyword}`,
        "description": `${total} hasil ditemukan untuk ${keyword}`,
        "url": window.location.href
    });

    document.head.append(script);
}

// ==========================================
// LANGKAH 6: Export Modul ke Window Object
// ==========================================
window.updateSearchSEO = updateSearchSEO;