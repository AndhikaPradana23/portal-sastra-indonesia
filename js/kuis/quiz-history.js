const QUIZ_HISTORY_KEY =
    "quiz_history";

function getQuizHistory(){

    const data =
        localStorage.getItem(
            QUIZ_HISTORY_KEY
        );

    return data
        ? JSON.parse(data)
        : [];

}

function saveQuizHistory(
    result
){

    const history =
        getQuizHistory();

    history.unshift({
        ...result,
        tanggal:
            new Date()
                .toISOString()
    });

    localStorage.setItem(
        QUIZ_HISTORY_KEY,
        JSON.stringify(
            history
        )
    );

}

function clearQuizHistory(){

    localStorage.removeItem(
        QUIZ_HISTORY_KEY
    );

}

window.getQuizHistory =
    getQuizHistory;

window.saveQuizHistory =
    saveQuizHistory;

window.clearQuizHistory =
    clearQuizHistory;