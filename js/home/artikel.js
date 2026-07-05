// =============================
// HOME SECTION: ARTIKEL
// =============================

async function loadLatestArtikel() {
    const container = document.getElementById("artikel-section");

    if (!container) return;

    try {
        const data = await fetchHomeData({
            table: "artikel",
            columns: "judul, slug, ringkasan, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Artikel Terbaru</h2>
                            <p class="section-description">Wawasan dan pembahasan menarik seputar dunia sastra.</p>
                        </div>
                    </div>
                    <p>Belum ada artikel.</p>
                </div>
            `;
            return;
        }

        // Render Section Header, Grid Card, dan tombol Lihat Semua secara utuh
        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Artikel Terbaru</h2>
                        <p class="section-description">Wawasan dan pembahasan menarik seputar dunia sastra.</p>
                    </div>
                </div>

                <div id="latest-artikel" class="home-grid">
                    ${data
                        .map(item => renderHomeCard({
                            badge: CoreHelpers.escapeHtml(HOME_CONFIG.artikel.badge),
                            title: item.judul,
                            description: item.ringkasan,
                            tipe: "artikel",
                            slug: item.slug,
                            url: HOME_CONFIG.artikel.detailUrl + item.slug,
                            buttonText: "Baca Selengkapnya →"
                        }))
                        .join("")}
                </div>

                <div style="text-align: center; margin-top: var(--space-6);">
                    <a href="/artikel/" class="btn btn-outline lihat-semua">
                        Lihat Semua Artikel
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="container">
                <p>Gagal memuat artikel.</p>
            </div>
        `;
    }
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js
window.loadLatestArtikel = loadLatestArtikel;