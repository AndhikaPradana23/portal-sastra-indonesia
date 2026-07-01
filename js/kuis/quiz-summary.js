function saveQuizResult(
    result
){

    localStorage.setItem(
        "quiz_result",
        JSON.stringify(
            result
        )
    );

}

function getQuizResult(){

    const data =
        localStorage.getItem(
            "quiz_result"
        );

    return data
        ? JSON.parse(data)
        : null;

}

window.saveQuizResult =
    saveQuizResult;

window.getQuizResult =
    getQuizResult;