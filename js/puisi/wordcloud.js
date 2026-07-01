function renderWordCloud(
    words
){

    if(
        !words.length
    ){
        return `
            <p>
                Tidak ada data.
            </p>
        `;
    }

    const max =
        words[0][1];

    return words
        .slice(0, 30)
        .map(
            (
                [kata, total]
            ) => {

                const size =
                    14 +
                    (
                        total / max
                    ) * 40;

                return `
                    <span
                        class="word-item"
                        style="
                            font-size:
                            ${size}px
                        "
                    >

                        ${kata}

                    </span>
                `;

            }
        )
        .join("");

}

window.renderWordCloud =
    renderWordCloud;