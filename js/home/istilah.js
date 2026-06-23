// =============================
// HOME SECTION: ISTILAH
// =============================

async function loadLatestIstilah() {
    const container = document.getElementById("latest-istilah");

    try {
        const data = await fetchHomeData({
            table: "istilah",
            columns: "nama, slug, definisi, created_at",
            orderBy: "created_at",
            ascending: false
        });

        if (!data || !data.length) {
            container.innerHTML = "<p>Belum ada istilah.</p>";
            return;
        }

        container.innerHTML = data
            .map(item => renderHomeCard({
                badge: HOME_CONFIG.istilah.badge,
                title: item.nama,
                description: item.definisi,
                url: HOME_CONFIG.istilah.detailUrl + item.slug,
                buttonText: "Lihat Istilah →"
            }))
            .join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat istilah.</p>";
    }
}