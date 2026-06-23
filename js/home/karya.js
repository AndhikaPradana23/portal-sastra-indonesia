// =============================
// HOME SECTION: KARYA
// =============================

async function loadLatestKarya() {
    const container = document.getElementById("latest-karya");

    try {
        const data = await fetchHomeData({
            table: "karya",
            columns: "judul, slug, deskripsi, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = "<p>Belum ada karya.</p>";
            return;
        }

        container.innerHTML = data
            .map(item => renderHomeCard({
                badge: HOME_CONFIG.karya.badge,
                title: item.judul,
                description: item.deskripsi,
                url: HOME_CONFIG.karya.detailUrl + item.slug,
                buttonText: "Lihat Karya →"
            }))
            .join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat karya.</p>";
    }
}