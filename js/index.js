document.addEventListener(
    "DOMContentLoaded",
    initHome
);

function initHome(){

    console.log(
        "Homepage Loaded"
    );

    
}

// ======================================================
// HOME ARTIKEL LOGIC
// Portal Sastra Indonesia
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    loadArtikelTerbaru
);

async function loadArtikelTerbaru() {
    const container = document.getElementById("latest-posts");

    // Mengambil maksimal 6 artikel terbaru dari Supabase
    const { data, error } = await supabaseClient
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat artikel.</p>";
        return;
    }

    if (!data || !data.length) {
        container.innerHTML = "<p>Belum ada artikel.</p>";
        return;
    }

    // Merender daftar kartu artikel ke HTML
    container.innerHTML = data.map(item => `
        <article class="post-card">
            <h3>${item.judul}</h3>
            <p>${item.ringkasan || ""}</p>
            <a class="read-more" href="artikel/detail.html?slug=${item.slug}">
                Baca Selengkapnya →
            </a>
        </article>
    `).join("");
}

