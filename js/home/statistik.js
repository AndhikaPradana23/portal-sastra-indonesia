// =============================
// HOME SECTION: STATISTIK
// =============================

async function loadWebsiteStats() {
    const container = document.getElementById("website-stats");

    try {
        const [istilah, artikel, sastrawan, karya] = await Promise.all([
            supabaseClient.from("istilah").select("*", { count: "exact", head: true }),
            supabaseClient.from("artikel").select("*", { count: "exact", head: true }),
            supabaseClient.from("sastrawan").select("*", { count: "exact", head: true }),
            supabaseClient.from("karya").select("*", { count: "exact", head: true })
        ]);

        container.innerHTML = `
            <article class="stat-box">
                <h3>${formatNumber(istilah.count)}</h3>
                <p>Istilah</p>
            </article>
            <article class="stat-box">
                <h3>${formatNumber(artikel.count)}</h3>
                <p>Artikel</p>
            </article>
            <article class="stat-box">
                <h3>${formatNumber(sastrawan.count)}</h3>
                <p>Sastrawan</p>
            </article>
            <article class="stat-box">
                <h3>${formatNumber(karya.count)}</h3>
                <p>Karya</p>
            </article>
        `;

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat statistik.</p>";
    }
}