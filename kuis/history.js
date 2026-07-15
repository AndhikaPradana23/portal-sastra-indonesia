// ==========================================
// INISIALISASI HALAMAN RIWAYAT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // Memuat layout template (jika ada fungsi loadLayout global)
        if (typeof loadLayout === "function") {
            await loadLayout();
        }

        // Panggil fungsi global renderBreadcrumb untuk halaman riwayat kuis
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Kuis Sastra",
                href: "/kuis/",
                icon: "/assets/icons/gamepad-2.svg"
            },
            {
                label: "Riwayat Nilai"
            }
        ]);

        renderQuizHistory();

        bindHistoryEvents();

    }
);

// ==========================================
// RENDERER RIWAYAT KUIS
// ==========================================

function renderQuizHistory(){

    const container =
        document.getElementById(
            "quiz-history"
        );

    if(
        !container
    ){
        return;
    }

    // Mengambil data riwayat dari fungsi lokal/global storage kuis
    const history =
        typeof getQuizHistory === "function" ? getQuizHistory() : [];

    if(
        !history || history.length === 0
    ){

        container.innerHTML = `
            <div class="empty-state">
                <img
                    src="/assets/icons/history.svg"
                    class="empty-icon"
                >
                <h3>
                    Belum Ada Riwayat Kuis
                </h3>
                <p>
                    Anda belum pernah mengikuti kuis sastra.
                </p>
                <a
                    href="/kuis/index.html"
                    class="btn btn-primary"
                >
                    <img
                        src="/assets/icons/play.svg"
                        class="btn-icon"
                    >
                    Mulai Kuis
                </a>
            </div>
        `;

        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-card fade-up">
            <div class="history-card-top">
                <div>
                    <span class="history-label">
                        <img
                            src="/assets/icons/book-open.svg"
                            class="label-icon"
                        >
                        Kategori
                    </span>
                    <strong>${item.kategori || "-"}</strong>
                </div>
                <div class="history-score">
                    ${item.nilai}
                </div>
            </div>
            <div class="history-stats">
                <div class="history-stat">
                    <img
                        src="/assets/icons/circle-check.svg"
                        class="label-icon"
                    >
                    <div>
                        <small>Benar</small>
                        <strong>
                            ${item.benar}/${item.total}
                        </strong>
                    </div>
                </div>
                <div class="history-stat">
                    <img
                        src="/assets/icons/circle-x.svg"
                        class="label-icon"
                    >
                    <div>
                        <small>Salah</small>
                        <strong>
                            ${item.salah}
                        </strong>
                    </div>
                </div>
                <div class="history-stat">
                    <img
                        src="/assets/icons/calendar-days.svg"
                        class="label-icon"
                    >
                    <div>
                        <small>Tanggal</small>
                        <strong>
                            ${new Date(item.tanggal).toLocaleString("id-ID")}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

}

// ==========================================
// EVENT HANDLER RIWAYAT
// ==========================================

function bindHistoryEvents(){

    document
        .getElementById(
            "clear-history-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                const ok =
                    confirm(
                        "Hapus semua riwayat?"
                    );

                if(
                    !ok
                ){
                    return;
                }

                if (typeof clearQuizHistory === "function") {
                    clearQuizHistory();
                }

                renderQuizHistory();

            }
        );

}

// ==========================================
// EXPORT TO WINDOW
// ==========================================

window.renderQuizHistory =
    renderQuizHistory;

window.bindHistoryEvents =
    bindHistoryEvents;