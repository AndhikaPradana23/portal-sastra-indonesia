/**
 * Menyimpan hasil kuis ke dalam tabel quiz_leaderboard di Supabase
 * @param {Object} result - Objek hasil kuis yang berisi nilai, benar, salah, dan total
 */
async function saveLeaderboard(
    result
){

    try{

        const session =
            await getSession();

        let nama =
            "Guest";

        let userId =
            null;

        if(session){

            nama =
                session.user.user_metadata
                    ?.nama ||
                session.user.email;

            userId =
                session.user.id;

        }

        const config =
            getQuizConfig();

        await supabaseClient
            .from(
                "quiz_leaderboard"
            )
            .insert({

                user_id:
                    userId,

                nama,

                kategori:
                    config.kategori,

                nilai:
                    result.nilai,

                benar:
                    result.benar,

                salah:
                    result.salah,

                total:
                    result.total

            });

    }
    catch(error){

        console.error(
            error
        );

    }

}

/**
 * Mengambil data 50 besar papan peringkat kuis dari Supabase
 * diurutkan berdasarkan nilai tertinggi dan waktu pembuatan terbaru
 * @returns {Array} Array objek data leaderboard atau array kosong jika terjadi error
 */
async function getLeaderboard(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from(
            "quiz_leaderboard"
        )
        .select("*")
        .order(
            "nilai",
            {
                ascending:
                    false
                }
        )
        .order(
            "created_at",
            {
                ascending:
                    false
            }
        )
        .limit(50);

    if(error){

        console.error(
            error
        );

        return [];

    }

    return data || [];

}

// LANGKAH 6: Renderer leaderboard ke dalam DOM elemen
async function renderLeaderboard(){

    const container =
        document.getElementById(
            "leaderboard-list"
        );

    if(!container){
        return;
    }

    const data =
        await getLeaderboard();

    if(
        !data.length
    ){

        container.innerHTML = `
            <p>

                Belum ada data.

            </p>
        `;

        return;
    }

    container.innerHTML =
        data
            .map(
                (
                    item,
                    index
                ) => `

                    <div
                        class="
                        leaderboard-card
                        "
                    >

                        <div>

                            ${
                                index === 0
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : `#${index + 1}`
                            }

                        </div>

                        <div>

                            <strong>

                                ${item.nama}

                            </strong> 

                            <br>

                            <small>

                                ${item.kategori}

                            </small>

                        </div>

                        <div>

                            ${item.nilai}

                        </div>

                    </div>

                `
            )
            .join("");

}

// Mengekspos layanan papan peringkat ke objek global window agar bisa diakses oleh skrip lain
window.LeaderboardService = {
    saveLeaderboard,
    getLeaderboard
};

// Mengekspos fungsi render secara global
window.renderLeaderboard =
    renderLeaderboard;