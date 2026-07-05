// =============================
// HOME SECTION: KARYA
// =============================

async function loadLatestKarya() {
    const container = document.getElementById("karya-section");

    if (!container) return;

    try {
        const data = await fetchHomeData({
            table: "karya",
            columns: "judul, slug, deskripsi, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Karya Terbaru</h2>
                            <p class="section-description">Eksplorasi karya sastra monumental, puisi, novel, dan esai pilihan.</p>
                        </div>
                    </div>
                    <p>Belum ada karya.</p>
                </div>
            `;
            return;
        }

        // Render Section Header, Grid Card, dan tombol Lihat Semua secara utuh
        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Karya Terbaru</h2>
                        <p class="section-description">Eksplorasi karya sastra monumental, puisi, novel, dan esai pilihan.</p>
                    </div>
                </div>

                <div id="latest-karya" class="home-grid">
                    ${data
                        .map(item => renderHomeCard({
                            badge: CoreHelpers.escapeHtml(HOME_CONFIG.karya.badge),
                            title: item.judul,
                            description: item.deskripsi,
                            tipe: "karya",
                            slug: item.slug,
                            url: HOME_CONFIG.karya.detailUrl + item.slug,
                            buttonText: "Lihat Karya →"
                        }))
                        .join("")}
                </div>

                <div style="text-align: center; margin-top: var(--space-6);">
                    <a href="/karya/" class="btn btn-outline lihat-semua">
                        Lihat Semua Karya
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="container">
                <p>Gagal memuat karya.</p>
            </div>
        `;
    }
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js
window.loadLatestKarya = loadLatestKarya;