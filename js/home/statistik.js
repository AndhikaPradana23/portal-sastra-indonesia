// =============================
// HOME SECTION: STATISTIK
// =============================

async function loadWebsiteStats() {
    const container = document.getElementById("statistik-section");

    if (!container) return;

    try {
        const [istilah, artikel, sastrawan, karya] = await Promise.all([
            supabaseClient.from("istilah").select("*", { count: "exact", head: true }),
            supabaseClient.from("artikel").select("*", { count: "exact", head: true }),
            supabaseClient.from("sastrawan").select("*", { count: "exact", head: true }),
            supabaseClient.from("karya").select("*", { count: "exact", head: true })
        ]);

        container.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Statistik Portal</h2>
                        <p class="section-description">Data perkembangan konten saat ini.</p>
                    </div>
                </div>
                <div id="website-stats" class="stats-grid">
                    <article class="stat-box">
                        <h3>${CoreHelpers.formatNumber(istilah.count || 0)}</h3>
                        <p>Istilah</p>
                    </article>
                    <article class="stat-box">
                        <h3>${CoreHelpers.formatNumber(artikel.count || 0)}</h3>
                        <p>Artikel</p>
                    </article>
                    <article class="stat-box">
                        <h3>${CoreHelpers.formatNumber(sastrawan.count || 0)}</h3>
                        <p>Sastrawan</p>
                    </article>
                    <article class="stat-box">
                        <h3>${CoreHelpers.formatNumber(karya.count || 0)}</h3>
                        <p>Karya</p>
                    </article>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="container">
                <p>Gagal memuat statistik.</p>
            </div>
        `;
    }
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js
window.loadWebsiteStats = loadWebsiteStats;