// =============================
// HOME SECTION: SASTRAWAN
// =============================

async function loadPopularSastrawan() {
    const container = document.getElementById("popular-sastrawan");

    try {
        const data = await fetchHomeData({
            table: "sastrawan",
            columns: "nama, slug, biografi_singkat, views",
            orderBy: "views",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = "<p>Belum ada sastrawan.</p>";
            return;
        }

        container.innerHTML = data
            .map(item => renderHomeCard({
                badge: CoreHelpers.escapeHtml(HOME_CONFIG.sastrawan.badge),
                title: item.nama,
                description: item.biografi_singkat,
                tipe: "sastrawan",
                slug: item.slug,
                url: HOME_CONFIG.sastrawan.detailUrl + item.slug,
                buttonText: "Lihat Profil →"
            }))
            .join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat sastrawan.</p>";
    }
}