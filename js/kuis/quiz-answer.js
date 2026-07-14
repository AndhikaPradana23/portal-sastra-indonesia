function saveQuizAnswer(
    index,
    answer
){

    const answers =
        JSON.parse(
            localStorage.getItem(
                "quiz_answers"
            )
        ) || {};

    answers[index] =
        answer;

    localStorage.setItem(
        "quiz_answers",
        JSON.stringify(
            answers
        )
    );

}

function getQuizAnswers(){

    return JSON.parse(
        localStorage.getItem(
            "quiz_answers"
        )
    ) || {};

}

function clearQuizAnswers(){

    localStorage.removeItem(
        "quiz_answers"
    );

}

window.saveQuizAnswer =
    saveQuizAnswer;

window.getQuizAnswers =
    getQuizAnswers;

window.clearQuizAnswers =
    clearQuizAnswers;