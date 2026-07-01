let currentQuestion =
    0;

function getCurrentQuestion(){

    return currentQuestion;

}

function setCurrentQuestion(
    value
){

    currentQuestion =
        value;

}

// LANGKAH 2: Buat renderer navigasi soal
function renderQuestionNavigation(){

    const container =
        document.getElementById(
            "question-navigation"
        );

    if(!container){
        return;
    }

    const questions =
        getQuizQuestions();

    const answers =
        getQuizAnswers();

    const current =
        getCurrentQuestion();

    container.innerHTML =
        questions
            .map(
                (
                    question,
                    index
                ) => {

                    let className =
                        "question-number";

                    if(
                        index === current
                    ){
                        className +=
                            " active";
                    }

                    if(
                        answers[index]
                    ){
                        className +=
                            " answered";
                    }

                    return `
                        <button
                            class="${className}"
                            data-index="${index}"
                        >
                            ${index + 1}
                        </button>
                    `;
                }
            )
            .join("");

}

// LANGKAH 3: Tambahkan event klik
function bindQuestionNavigation(){

    document
        .getElementById(
            "question-navigation"
        )
        ?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".question-number"
                    );

                if(
                    !button
                ){
                    return;
                }

                const index =
                    Number(
                        button.dataset.index
                    );

                setCurrentQuestion(
                    index
                );

                renderCurrentQuestion();

            }
        );

}

// BONUS 2: Renderer Statistik Progress
function renderQuizStatus(){

    const answers =
        getQuizAnswers();

    const total =
        getQuizQuestions().length;

    const answered =
        Object.keys(
            answers
        ).length;

    document
        .getElementById(
            "quiz-status"
        )
        .textContent =
            `Terjawab ${answered} dari ${total} soal`;

}

// Export ke object window agar bisa diakses secara global oleh file script lain
window.getCurrentQuestion =
    getCurrentQuestion;

window.setCurrentQuestion =
    setCurrentQuestion;

window.renderQuestionNavigation =
    renderQuestionNavigation;

window.bindQuestionNavigation =
    bindQuestionNavigation;

// Export fungsi bonus statistik progress
window.renderQuizStatus = 
    renderQuizStatus;