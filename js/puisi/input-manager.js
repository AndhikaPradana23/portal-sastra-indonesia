function initPuisiInput(){

    const textarea =
        document.getElementById(
            "puisi-input"
        );

    const charCount =
        document.getElementById(
            "char-count"
        );

    const lineCount =
        document.getElementById(
            "line-count"
        );

    const analyzeBtn =
        document.getElementById(
            "analyze-btn"
        );

    const clearBtn =
        document.getElementById(
            "clear-btn"
        );

    const exampleBtn =
        document.getElementById(
            "example-btn"
        );

    if(!textarea){
        return;
    }

    textarea.addEventListener(
        "input",
        updateInputInfo
    );

    clearBtn.addEventListener(
        "click",
        clearInput
    );

    exampleBtn.addEventListener(
        "click",
        loadExample
    );

    function updateInputInfo(){

        const text =
            textarea.value;

        const karakter =
            text.length;

        const baris =
            text.trim()
                ? text.split("\n").length
                : 0;

        charCount.textContent =
            `Karakter: ${karakter}`;

        lineCount.textContent =
            `Baris: ${baris}`;

        analyzeBtn.disabled =
            text.trim() === "";

    }

    function clearInput(){

        textarea.value = "";

        updateInputInfo();

        document
            .getElementById(
                "analysis-result"
            )
            .innerHTML =
            "Belum ada analisis.";

        textarea.focus();
    }

    function loadExample(){

        textarea.value = `
Aku ini binatang jalang
Dari kumpulannya terbuang

Biar peluru menembus kulitku
Aku tetap meradang menerjang
`.trim();

        updateInputInfo();
    }

    updateInputInfo();

}