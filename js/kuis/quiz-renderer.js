function renderQuestion(
    question,
    index,
    total
){

    const answers =
        getQuizAnswers();

    const selected =
        answers[index];

    document
        .getElementById(
            "quiz-progress"
        )
        .innerHTML = `

            <h3>

                Soal
                ${index + 1}
                dari
                ${total}

            </h3>

        `;

    document
        .getElementById(
            "quiz-container"
        )
        .innerHTML = `

            <div class="quiz-card">

                <h2>

                    ${question.question}

                </h2>

                <div
                    class="quiz-options"
                >

                    ${
                        question.options
                            .map(
                                option => `

                                    <label
                                        class="
                                        quiz-option
                                        "
                                    >

                                        <input
                                            type="radio"
                                            name="quiz-answer"
                                            value="${option}"
                                            ${
                                                selected === option
                                                    ? "checked"
                                                    : ""
                                            }
                                        >

                                        <span>
                                            ${option}
                                        </span>

                                    </label>

                                `
                            )
                            .join("")
                    }

                </div>

            </div>

        `;

}
window.renderQuestion =
    renderQuestion;