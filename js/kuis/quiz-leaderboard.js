/**
 * ==========================================================
 * LEADERBOARD SERVICE
 * Satu akun = satu baris leaderboard
 * Skor bersifat akumulatif per kategori
 * ==========================================================
 */

const LEADERBOARD_CATEGORY_MAP = {
    istilah: "total_istilah",
    sastrawan: "total_sastrawan",
    karya: "total_karya",
    campuran: "total_campuran"
};

/**
 * ==========================================================
 * SIMPAN LEADERBOARD
 * ==========================================================
 */
async function saveLeaderboard(result){
    try{
        // Memakai getCurrentUser() sesuai dengan Solusi 3
        const user = await getCurrentUser();

        if(!user){
            return;
        }

        const userId = user.id;
        
        // Pembaruan A: Menggunakan fallback username -> nama_lengkap -> email prefix
        const username = user.user_metadata?.username;
        const namaLengkap = user.user_metadata?.nama_lengkap;
        const nama = username || namaLengkap || user.email.split("@")[0];

        const config = getQuizConfig();
        const kategori = config.kategori;
        const field = LEADERBOARD_CATEGORY_MAP[kategori];

        if(!field){
            console.warn(
                "Kategori leaderboard tidak dikenal:",
                kategori
            );
            return;
        }

        //------------------------------------------------------
        const {
            data: existing,
            error
        } = await supabaseClient
            .from("quiz_leaderboard")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if(error){
            throw error;
        }

        //------------------------------------------------------
        let leaderboard;

        if(existing){
            leaderboard = {
                ...existing
            };
        }
        else{
            leaderboard = {
                user_id: userId,
                nama,
                total_istilah: 0,
                total_sastrawan: 0,
                total_karya: 0,
                total_campuran: 0,
                total_semua: 0,
                jumlah_kuis: 0
            };
        }

        //------------------------------------------------------
        leaderboard.nama = nama;

        // Logging untuk memastikan nilai nama yang akan disimpan
        console.log(
            "Nama leaderboard:",
            nama
        );

        leaderboard[field] += result.nilai;
        leaderboard.jumlah_kuis += 1;

        leaderboard.total_semua =
            leaderboard.total_istilah +
            leaderboard.total_sastrawan +
            leaderboard.total_karya +
            leaderboard.total_campuran;

        leaderboard.updated_at = new Date().toISOString();

        //------------------------------------------------------
        const {
            error: updateError
        } = await supabaseClient
            .from("quiz_leaderboard")
            .upsert(
                leaderboard,
                {
                    onConflict: "user_id"
                }
            );

        if(updateError){
            throw updateError;
        }
    }
    catch(error){
        console.error(
            "Leaderboard:",
            error
        );
    }
}

/**
 * ==========================================================
 * AMBIL LEADERBOARD
 * ==========================================================
 */
async function getLeaderboard(){
    const {
        data,
        error
    } =
    await supabaseClient
        .from("quiz_leaderboard")
        .select("*")
        .order(
            "total_semua",
            {
                ascending:false
            }
        )
        .limit(50);

    if(error){
        console.error(error);
        return [];
    }

    return data || [];
}

/**
 * ==========================================================
 * RENDER LEADERBOARD
 * ==========================================================
 */
async function renderLeaderboard(){
    const container = document.getElementById("leaderboard-list");

    if(!container){
        return;
    }

    const data = await getLeaderboard();

    if(!data.length){
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏆</div>
                <h3>Belum ada leaderboard.</h3>
            </div>
        `;
        return;
    }

    container.innerHTML = data
        .map((item,index)=>{

            const medal =
                index===0
                ? "🥇"
                : index===1
                ? "🥈"
                : index===2
                ? "🥉"
                : `#${index+1}`;

            return `
                <div class="leaderboard-card fade-up">
                    <div class="leaderboard-rank">${medal}</div>
                    <div class="leaderboard-user">
                        <div class="leaderboard-name">
                            <strong>${item.nama}</strong>
                        </div>
                        <div class="leaderboard-meta">
                            <div>
                                <img src="/assets/icons/book-open.svg" class="label-icon">
                                Istilah
                                <b>${item.total_istilah}</b>
                            </div>
                            <div>
                                <img src="/assets/icons/user-round.svg" class="label-icon">
                                Sastrawan
                                <b>${item.total_sastrawan}</b>
                            </div>
                            <div>
                                <img src="/assets/icons/library.svg" class="label-icon">
                                Karya
                                <b>${item.total_karya}</b>
                            </div>
                            <div>
                                <img src="/assets/icons/target.svg" class="label-icon">
                                Campuran
                                <b>${item.total_campuran}</b>
                            </div>
                        </div>
                        <div class="leaderboard-total">
                            <img src="/assets/icons/clipboard-list.svg" class="label-icon">${item.jumlah_kuis} Kuis
                        </div>
                    </div>
                    <div class="leaderboard-score">${item.total_semua}</div>
                </div>
            `;
        }).join("");
}

/**
 * ==========================================================
 * EXPOSE SERVICE TO WINDOW
 * ==========================================================
 */
window.LeaderboardService = {
    saveLeaderboard,
    getLeaderboard
};

window.renderLeaderboard = renderLeaderboard;