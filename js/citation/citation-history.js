const STORAGE_KEY =
    "citationHistory";

function getCitationHistory(){

    return JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || [];

}

function saveCitationHistory(
    citation
){

    let history =
        getCitationHistory();

    history.unshift(
        citation
    );

    history =
        history.slice(
            0,
            20
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            history
        )
    );

}

function clearCitationHistory(){

    localStorage.removeItem(
        STORAGE_KEY
    );

}