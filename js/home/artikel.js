// =============================
// HOME SECTION: ARTIKEL
// =============================

async function loadLatestArtikel() {
    const container = document.getElementById("latest-artikel");

    try {
        const data = await fetchHomeData({
            table: "artikel",
            columns: "judul, slug, ringkasan, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = "<p>Belum ada artikel.</p>";
            return;
        }

        container.innerHTML = data
            .map(item => renderHomeCard({
                badge: HOME_CONFIG.artikel.badge,
                title: item.judul,
                description: item.ringkasan,
                url: HOME_CONFIG.artikel.detailUrl + item.slug,
                buttonText: "Baca Selengkapnya →"
            }))
            .join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat artikel.</p>";
    }
}