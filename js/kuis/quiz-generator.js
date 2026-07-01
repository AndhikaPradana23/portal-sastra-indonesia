/**
 * Generator Soal Istilah
 */
function generateIstilahQuestions(data) {
    const questions = [];

    data.forEach(item => {
        if (!item.definisi) {
            return;
        }

        const wrongAnswers = shuffle(
            data
                .filter(x => x.id !== item.id)
                .map(x => x.definisi)
        ).slice(0, 3);

        questions.push({
            type: "istilah",
            question: `Apa definisi dari istilah "${item.nama}"?`,
            correct: item.definisi,
            options: shuffle([
                item.definisi,
                ...wrongAnswers
            ])
        });
    });

    return questions;
}

/**
 * Generator Soal Sastrawan
 */
function generateSastrawanQuestions(data) {
    const questions = [];

    data.forEach(item => {
        if (!item.karya_terkenal) {
            return;
        }

        const wrong = shuffle(
            data
                .filter(x => x.id !== item.id)
                .map(x => x.nama)
        ).slice(0, 3);

        questions.push({
            type: "sastrawan",
            question: `Siapakah penulis "${item.karya_terkenal}"?`,
            correct: item.nama,
            options: shuffle([
                item.nama,
                ...wrong
            ])
        });
    });

    return questions;
}

/**
 * Generator Soal Karya
 */
function generateKaryaQuestions(data) {
    const questions = [];

    data.forEach(item => {
        if (!item.penulis) {
            return;
        }

        const wrong = shuffle(
            data
                .filter(x => x.id !== item.id)
                .map(x => x.penulis)
        ).slice(0, 3);

        questions.push({
            type: "karya",
            question: `Siapakah penulis karya "${item.judul}"?`,
            correct: item.penulis,
            options: shuffle([
                item.penulis,
                ...wrong
            ])
        });
    });

    return questions;
}

// Mengekspos fungsi-fungsi ke objek global window
window.QuizGenerator = {
    generateIstilahQuestions,
    generateSastrawanQuestions,
    generateKaryaQuestions
};