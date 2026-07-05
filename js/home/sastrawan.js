// =============================
// HOME SECTION: SASTRAWAN
// =============================

async function loadPopularSastrawan() {
    const container = document.getElementById("sastrawan-section");

    if (!container) return;

    try {
        const data = await fetchHomeData({
            table: "sastrawan",
            columns: "nama, slug, biografi_singkat, views",
            orderBy: "views",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Sastrawan Populer</h2>
                            <p class="section-description">Mengenal tokoh-tokoh penting dalam sejarah sastra Indonesia.</p>
                        </div>
                    </div>
                    <p>Belum ada sastrawan.</p>
                </div>
            `;
            return;
        }

        // Render Section Header, Grid Card, dan tombol Lihat Semua secara utuh
        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Sastrawan Populer</h2>
                        <p class="section-description">Mengenal tokoh-tokoh penting dalam sejarah sastra Indonesia.</p>
                    </div>
                </div>

                <div id="popular-sastrawan" class="home-grid">
                    ${data
                        .map(item => renderHomeCard({
                            badge: CoreHelpers.escapeHtml(HOME_CONFIG.sastrawan.badge),
                            title: item.nama,
                            description: item.biografi_singkat,
                            tipe: "sastrawan",
                            slug: item.slug,
                            url: HOME_CONFIG.sastrawan.detailUrl + item.slug,
                            buttonText: "Lihat Profil →"
                        }))
                        .join("")}
                </div>

                <div style="text-align: center; margin-top: var(--space-6);">
                    <a href="/sastrawan/" class="btn btn-outline lihat-semua">
                        Lihat Semua Sastrawan
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="container">
                <p>Gagal memuat sastrawan.</p>
            </div>
        `;
    }
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js
window.loadPopularSastrawan = loadPopularSastrawan;