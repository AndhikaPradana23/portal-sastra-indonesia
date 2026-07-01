const QUIZ_TIME_KEY =
    "quiz_time";

/**
 * Manajemen Konfigurasi Kuis
 */
function saveQuizConfig(data) {
    localStorage.setItem(
        "quiz_config",
        JSON.stringify(data)
    );
}

function getQuizConfig() {
    const data = localStorage.getItem("quiz_config");

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

/**
 * Manajemen Soal Kuis
 */
function saveQuizQuestions(questions) {
    localStorage.setItem(
        "quiz_questions",
        JSON.stringify(questions)
    );
}

function getQuizQuestions() {
    const data = localStorage.getItem("quiz_questions");

    return data 
        ? JSON.parse(data) 
        : [];
}

/**
 * Manajemen Sisa Waktu Kuis
 */
function saveQuizTime(
    seconds
){

    localStorage.setItem(
        QUIZ_TIME_KEY,
        seconds
    );

}

function getQuizTime(){

    return Number(
        localStorage.getItem(
            QUIZ_TIME_KEY
        )
    );

}

// Mengekspos fungsi-fungsi ke objek global window
window.saveQuizConfig = saveQuizConfig;
window.getQuizConfig = getQuizConfig;
window.saveQuizQuestions = saveQuizQuestions;
window.getQuizQuestions = getQuizQuestions;
window.saveQuizTime = saveQuizTime;
window.getQuizTime = getQuizTime;