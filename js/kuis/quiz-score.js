function calculateQuizScore(){

    const questions =
        getQuizQuestions();

    const answers =
        getQuizAnswers();

    let benar = 0;

    const detail = [];

    questions.forEach(
        (
            question,
            index
        ) => {

            const userAnswer =
                answers[index];

            const isCorrect =
                userAnswer ===
                question.correct;

            if(
                isCorrect
            ){
                benar++;
            }

            detail.push({
                nomor:
                    index + 1,

                question:
                    question.question,

                userAnswer,

                correct:
                    question.correct,

                isCorrect,

                type:
                    question.type
            });

        }
    );

    const total =
        questions.length;

    const salah =
        total - benar;

    const nilai =
        total
            ? Math.round(
                (
                    benar /
                    total
                ) * 100
              )
            : 0;

    return {
        benar,
        salah,
        total,
        nilai,
        detail
    };

}

window.calculateQuizScore =
    calculateQuizScore;