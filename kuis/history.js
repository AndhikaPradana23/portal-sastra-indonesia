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
            <p>

                Belum ada
                riwayat nilai.

            </p>
        `;

        return;
    }

    container.innerHTML =
        history
            .map(
                item => `

                    <div
                        class="
                        history-card
                        "
                    >

                        <div>

                            <strong>

                                Kategori

                            </strong> 

                            :
                            ${item.kategori || "-"}

                        </div>

                        <div>

                            <strong>

                                Nilai

                            </strong> 

                            :
                            ${item.nilai}

                        </div>

                        <div>

                            <strong>

                                Benar

                            </strong> 

                            :
                            ${item.benar}
                            /
                            ${item.total}

                        </div>

                        <div>

                            <strong>

                                Salah

                            </strong> 

                            :
                            ${item.salah}

                        </div>

                        <div>

                            <strong>

                                Tanggal

                            </strong> 

                            :
                            ${new Date(
                                item.tanggal
                            ).toLocaleString(
                                "id-ID"
                            )}

                        </div>

                    </div>

                `
            )
            .join("");

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