// js/kuis/quiz-page.js

/**
 * Memulai kuis dengan mengambil data dari service, 
 * membuat soal lewat generator, dan menyimpannya ke storage.
 */
async function startQuiz() {
    const kategori = document.getElementById("quiz-category").value;
    const total = Number(document.getElementById("quiz-total").value);

    saveQuizConfig({
        kategori,
        total
    });

    let questions = [];

    if (kategori === "istilah") {
        const data = await QuizService.getIstilahQuizData();
        questions = QuizGenerator.generateIstilahQuestions(data);
    } 
    else if (kategori === "sastrawan") {
        const data = await QuizService.getSastrawanQuizData();
        questions = QuizGenerator.generateSastrawanQuestions(data);
    } 
    else if (kategori === "karya") {
        const data = await QuizService.getKaryaQuizData();
        questions = QuizGenerator.generateKaryaQuestions(data);
    } 
    else {
        // Jika kategori "semua" / campuran, ambil semua data secara paralel
        const [istilah, sastrawan, karya] = await Promise.all([
            QuizService.getIstilahQuizData(),
            QuizService.getSastrawanQuizData(),
            QuizService.getKaryaQuizData()
        ]);

        questions = [
            ...QuizGenerator.generateIstilahQuestions(istilah),
            ...QuizGenerator.generateSastrawanQuestions(sastrawan),
            ...QuizGenerator.generateKaryaQuestions(karya)
        ];
    }

    // Acak keseluruhan soal yang berhasil digenerate, lalu potong sesuai jumlah total permintaan
    questions = shuffle(questions).slice(0, total);

    // Simpan hasil generate soal ke localStorage
    saveQuizQuestions(questions);

    // Bersihkan status timer lama agar tidak mengganggu kuis baru
    localStorage.removeItem(
        "quiz_time"
    );

    // Alihkan halaman ke area permainan kuis
    window.location.href = "/kuis/play.html";
}

/**
 * Inisialisasi event listener pada halaman pengaturan kuis
 */
function initQuizPage() {
    document
        .getElementById("start-quiz-btn")
        ?.addEventListener("click", startQuiz);
}

// Mengekspos fungsi inisialisasi ke objek global window
window.initQuizPage = initQuizPage;