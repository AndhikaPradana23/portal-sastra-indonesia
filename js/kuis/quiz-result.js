// ==========================================
// STORAGE HASIL KUIS
// ==========================================

function saveQuizResult(result){

    localStorage.setItem(
        "quiz_result",
        JSON.stringify(result)
    );

}

function getQuizResult(){

    return JSON.parse(
        localStorage.getItem(
            "quiz_result"
        )
    );

}

function clearQuizResult(){

    localStorage.removeItem(
        "quiz_result"
    );

}

// ==========================================
// BADGE NILAI
// ==========================================

function getScoreBadge(score){

    if(score >= 90){

        return {
            text : "Sangat Baik",
            className : "badge-success"
        };

    }

    if(score >= 75){

        return {
            text : "Baik",
            className : "badge-primary"
        };

    }

    if(score >= 60){

        return {
            text : "Cukup",
            className : "badge-warning"
        };

    }

    return {
        text : "Perlu Belajar Lagi",
        className : "badge-danger"
    };

}

// ==========================================
// REVIEW
// ==========================================

function renderReview(){

    const result =
        getQuizResult();

    if(!result){
        return "";
    }

    return result.detail.map(item => `

        <div class="review-card">

            <h3>

                <img
                    src="/assets/icons/circle-question-mark.svg"
                    class="label-icon"
                    alt=""
                >

                Soal ${item.nomor}

            </h3>

            <p>

                ${item.question}

            </p>

            <div class="review-answer">

                <strong>

                    <img
                        src="/assets/icons/user.svg"
                        class="label-icon"
                        alt=""
                    >

                    Jawaban Anda

                </strong>

                <p>

                    ${item.userAnswer || "-"}

                    <img
                        src="/assets/icons/${
                            item.isCorrect
                                ? "circle-check.svg"
                                : "circle-x.svg"
                        }"
                        class="label-icon"
                        alt=""
                    >

                </p>

            </div>

            ${
                !item.isCorrect
                ?

                `

                <div class="review-correct">

                    <strong>

                        <img
                            src="/assets/icons/check-check.svg"
                            class="label-icon"
                            alt=""
                        >

                        Jawaban Benar

                    </strong>

                    <p>

                        ${item.correct}

                    </p>

                </div>

                `

                :

                ""

            }

            <div class="review-explanation">

                <strong>

                    <img
                        src="/assets/icons/book-open.svg"
                        class="label-icon"
                        alt=""
                    >

                    Pembahasan

                </strong>

                <p>

                    ${getPembahasan(item)}

                </p>

            </div>

        </div>

    `).join("");

}

// ==========================================
// MAIN RENDER
// ==========================================

function renderQuizResult(){

    const result =
        getQuizResult();

    if(!result){

        window.location.href =
            "/kuis/index.html";

        return;

    }

    const badge =
        getScoreBadge(result.nilai);

    document.getElementById(
        "quiz-result"
    ).innerHTML = `

        <div class="result-card">

            <div class="quiz-hero">

                <div class="quiz-hero-icon">

                    <img
                        src="/assets/icons/${
                            result.timeout
                                ? "clock-3.svg"
                                : "trophy.svg"
                        }"
                        alt=""
                    >

                </div>

                <h1>

                    ${
                        result.timeout
                            ? "Waktu Habis"
                            : "Kuis Selesai"
                    }

                </h1>

                <p>

                    ${
                        result.timeout
                        ?

                        "Waktu pengerjaan telah berakhir."

                        :

                        "Selamat! Anda telah menyelesaikan kuis."

                    }

                </p>

            </div>

            <div class="result-score">

                ${result.nilai}

            </div>

            <div
                class="
                    badge
                    result-badge
                    ${badge.className}
                "
            >

                ${badge.text}

            </div>

            <div class="result-stats">

                <div class="result-stat-card">

                    <img
                        src="/assets/icons/circle-check.svg"
                        class="result-stat-icon"
                        alt=""
                    >

                    <div class="result-stat-label">

                        Jawaban Benar

                    </div>

                    <div class="result-stat-value">

                        ${result.benar}

                    </div>

                </div>

                <div class="result-stat-card">

                    <img
                        src="/assets/icons/circle-x.svg"
                        class="result-stat-icon"
                        alt=""
                    >

                    <div class="result-stat-label">

                        Jawaban Salah

                    </div>

                    <div class="result-stat-value">

                        ${result.salah}

                    </div>

                </div>

                <div class="result-stat-card">

                    <img
                        src="/assets/icons/list-checks.svg"
                        class="result-stat-icon"
                        alt=""
                    >

                    <div class="result-stat-label">

                        Total Soal

                    </div>

                    <div class="result-stat-value">

                        ${result.total}

                    </div>

                </div>

            </div>

            <div class="result-actions">

                <a
                    href="/kuis/play.html"
                    class="btn btn-primary"
                >

                    <img
                        src="/assets/icons/rotate-ccw.svg"
                        class="label-icon"
                        alt=""
                    >

                    Ulangi Kuis

                </a>

                <a
                    href="/kuis/history.html"
                    class="btn btn-outline"
                >

                    <img
                        src="/assets/icons/history.svg"
                        class="label-icon"
                        alt=""
                    >

                    Riwayat Nilai

                </a>

                <a
                    href="/kuis/leaderboard.html"
                    class="btn btn-outline"
                >

                    <img
                        src="/assets/icons/trophy.svg"
                        class="label-icon"
                        alt=""
                    >

                    Leaderboard

                </a>

            </div>

        </div>

        <section class="review-section">

            <h2>

                <img
                    src="/assets/icons/book-open.svg"
                    class="section-icon"
                    alt=""
                >

                Pembahasan Jawaban

            </h2>

            ${renderReview()}

        </section>

    `;

}

// ==========================================
// EXPORT
// ==========================================

window.saveQuizResult =
    saveQuizResult;

window.getQuizResult =
    getQuizResult;

window.clearQuizResult =
    clearQuizResult;

window.renderQuizResult =
    renderQuizResult;