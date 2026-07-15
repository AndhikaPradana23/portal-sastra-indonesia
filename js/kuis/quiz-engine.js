/**
 * Menginisialisasi mesin kuis saat halaman dimuat
 */
function initQuizEngine(){

    const questions =
        getQuizQuestions();

    if(!questions.length){

        window.location.href =
            "/kuis/index.html";

        return;

    }

    renderCurrentQuestion();

    bindQuestionEvents();

    // LANGKAH 5: Inisialisasi event panel navigasi soal
    bindQuestionNavigation();

    startQuizTimer();

}

/**
 * Merender pertanyaan aktif beserta komponen navigasinya
 */
function renderCurrentQuestion(){
    const questions = getQuizQuestions();
    const index = getCurrentQuestion();

    renderQuestion(
        questions[index],
        index,
        questions.length
    );

    updateNavigation();

    // LANGKAH 4: Render panel navigasi soal setiap kali soal berubah
    renderQuestionNavigation();

    // BONUS 2: Perbarui statistik progres jumlah terjawab
    renderQuizStatus();
}

/**
 * Menghubungkan event handler ke elemen-elemen kontrol kuis
 */
function bindQuestionEvents(){
    document
        .getElementById("quiz-container")
        .addEventListener("change", event => {
            if(event.target.name !== "quiz-answer"){
                return;
            }

            saveQuizAnswer(
                getCurrentQuestion(),
                event.target.value
            );

            // LANGKAH 6: Simpan status jawaban dan langsung perbarui panel navigasi
            renderQuestionNavigation();
        });

    document
        .getElementById("next-btn")
        .addEventListener("click", nextQuestion);

    document
        .getElementById("prev-btn")
        .addEventListener("click", previousQuestion);
}

/**
 * Melangkah ke pertanyaan berikutnya atau menyelesaikan kuis jika sudah di akhir soal
 */
function nextQuestion(){
    const questions = getQuizQuestions();
    let index = getCurrentQuestion();

    if(index < questions.length - 1){
        index++;
        setCurrentQuestion(index);
        renderCurrentQuestion();
    }
    else{
        finishQuiz();
    }
}

/**
 * Kembali ke pertanyaan sebelumnya
 */
function previousQuestion(){
    let index = getCurrentQuestion();

    if(index > 0){
        index--;
        setCurrentQuestion(index);
        renderCurrentQuestion();
    }
}

/**
 * Memperbarui status tombol navigasi (Sebelumnya / Selanjutnya / Selesai)
 */
function updateNavigation(){
    const questions = getQuizQuestions();
    const index = getCurrentQuestion();

    // Mengatur tombol "Sebelumnya"
    document
        .getElementById("prev-btn")
        .disabled = index === 0;

    // Mengatur teks tombol "Selanjutnya" atau "Selesai"
    const nextButton = document.getElementById("next-btn");

    if(index === questions.length - 1){
        nextButton.textContent = "Selesai";
    }
    else{
        nextButton.textContent = "Selanjutnya →";
    }
}

/**
 * Mengakhiri sesi kuis, menghitung skor, menyimpan hasil, dan pindah ke halaman skor
 */
async function finishQuiz(
    timeout = false
){

    const result =
        calculateQuizScore();

    result.timeout =
        timeout;

    saveQuizResult(
        result
    );

    saveQuizHistory({
        ...result,
        kategori:
            getQuizConfig()
                .kategori
    });

    // LANGKAH 3: Simpan data hasil kuis ke papan peringkat (Leaderboard)
    await LeaderboardService
        .saveLeaderboard(
            result
        );

    // 4. Reset seluruh parameter sesi pengerjaan kuis ketika selesai
    localStorage.removeItem("quiz_time");
    clearQuizAnswers();
    setCurrentQuestion(0);

    window.location.href =
        "/kuis/result.html";

}

// Mengekspos fungsi ke objek global window
window.initQuizEngine = initQuizEngine;
window.renderCurrentQuestion = renderCurrentQuestion;