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
// RENDERER PEMBAHASAN
// ==========================================

function renderReview(){

    const result =
        getQuizResult();

    if(
        !result
    ){
        return "";
    }

    return result.detail
        .map(
            item => `

                <div
                    class="
                    review-card
                    "
                >

                    <h3>

                        Soal
                        ${item.nomor}

                    </h3>

                    <p>

                        ${item.question}

                    </p>

                    <div
                        class="
                        review-answer
                        "
                    >

                        <strong>

                            Jawaban Anda

                        </strong> 

                        <p>

                            ${
                                item.userAnswer ||
                                "-"
                            }

                            ${
                                item.isCorrect
                                ? "✅"
                                : "❌"
                            }

                        </p>

                    </div>

                    ${
                        !item.isCorrect
                        ?
                        `
                            <div
                                class="
                                review-correct
                                "
                            >

                                <strong>

                                    Jawaban Benar

                                </strong> 

                                <p>

                                    ${item.correct}
                                    ✅

                                </p>

                            </div>
                        `
                        :
                        ""
                    }

                    <div
                        class="
                        review-explanation
                        "
                    >

                        <strong>

                            Pembahasan

                        </strong> 

                        <p>

                            ${
                                getPembahasan(
                                    item
                                )
                            }

                        </p>

                    </div>

                </div>

            `
        )
        .join("");

}

// ==========================================
// MAIN RENDERER
// ==========================================

function renderQuizResult(){

    const result =
        getQuizResult();

    if(
        !result
    ){

        window.location.href =
            "/kuis/index.html";

        return;

    }

    document
        .getElementById(
            "quiz-result"
        )
        .innerHTML = `

            <div
                class="
                result-card
                "
            >

                <h1>

                    ${
                        result.timeout
                            ? "⏰ Waktu Habis"
                            : "🎉 Kuis Selesai"
                    }

                </h1>

                <div
                    class="
                    result-score
                    "
                >

                    ${result.nilai}

                </div>

                <div
                    class="
                    result-item
                    "
                >

                    <strong>
                        Benar
                    </strong>

                    <span>
                        ${result.benar}
                    </span>

                </div>

                <div
                    class="
                    result-item
                    "
                >

                    <strong>
                        Salah
                    </strong>

                    <span>
                        ${result.salah}
                    </span>

                </div>

                <div
                    class="
                    result-item
                    "
                >

                    <strong>
                        Total
                    </strong>

                    <span>
                        ${result.total}
                    </span>

                </div>

                <div
                    class="
                    result-actions
                    "
                >

                    <a
                        href="/kuis/index.html"
                        class="
                        result-button
                        "
                    >
                        Ulangi Kuis
                    </a>

                    <a
                        href="/kuis/history.html"
                        class="
                        result-button
                        "
                    >
                        Riwayat Nilai
                    </a>

                    <a
                        href="/kuis/leaderboard.html"
                        class="
                        result-button
                        "
                    >
                        Leaderboard
                    </a>

                </div>

            </div>

            <section
                class="
                review-section
                "
            >

                <h2>

                    Pembahasan Jawaban

                </h2>

                ${renderReview()}

            </section>

    `;

}

// ==========================================
// EXPORT TO WINDOW
// ==========================================

window.saveQuizResult =
    saveQuizResult;

window.getQuizResult =
    getQuizResult;

window.clearQuizResult =
    clearQuizResult;

window.renderQuizResult =
    renderQuizResult;