let timerInterval =
    null;

function startQuizTimer(){

    const config =
        getQuizConfig();

    let seconds =
        getQuizTime();

    if(!seconds){

        seconds =
            config.total * 60;

        saveQuizTime(
            seconds
        );

    }

    renderQuizTimer(
        seconds
    );

    timerInterval =
        setInterval(() => {

            seconds--;

            saveQuizTime(
                seconds
            );

            renderQuizTimer(
                seconds
            );

            if(seconds <= 0){

                clearInterval(
                    timerInterval
                );

                finishQuiz(
                    true
                );

            }

        }, 1000);

}

function renderQuizTimer(
    seconds
){

    const timer =
        document.getElementById(
            "quiz-timer"
        );

    if(!timer){
        return;
    }

    const minute =
        Math.floor(
            seconds / 60
        );

    const second =
        seconds % 60;

    timer.textContent =
        `⏱ ${String(minute)
            .padStart(2,"0")}:${String(second)
            .padStart(2,"0")}`;

    if(seconds <= 60){
        timer.classList.add(
            "warning"
        );
    }

}

window.startQuizTimer =
    startQuizTimer;