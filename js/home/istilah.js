// =============================
// HOME SECTION: ISTILAH
// =============================

async function loadLatestIstilah() {
    const container = document.getElementById("istilah-section");

    if (!container) return;

    try {
        const data = await fetchHomeData({
            table: "istilah",
            columns: "nama, slug, definisi, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Istilah Terbaru</h2>
                            <p class="section-description">Kumpulan istilah sastra Indonesia.</p>
                        </div>
                    </div>
                    <p>Belum ada istilah.</p>
                </div>
            `;
            return;
        }

        // Render Section Header, Grid Card, dan tombol Lihat Semua secara utuh
        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Istilah Terbaru</h2>
                        <p class="section-description">Kumpulan istilah sastra Indonesia.</p>
                    </div>
                </div>

                <div id="latest-istilah" class="home-grid">
                    ${data
                        .map(item => renderHomeCard({
                            badge: CoreHelpers.escapeHtml(HOME_CONFIG.istilah.badge),
                            title: item.nama,
                            description: item.definisi,
                            tipe: "istilah",
                            slug: item.slug,
                            url: HOME_CONFIG.istilah.detailUrl + item.slug,
                            buttonText: "Lihat Istilah →"
                        }))
                        .join("")}
                </div>

                <div style="text-align: center; margin-top: var(--space-6);">
                    <a href="/kamus-istilah/" class="btn btn-outline lihat-semua">
                        Lihat Semua Istilah
                    </a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="container">
                <p>Gagal memuat istilah.</p>
            </div>
        `;
    }
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js
window.loadLatestIstilah = loadLatestIstilah;