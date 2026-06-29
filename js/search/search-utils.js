function highlightKeyword(
    text,
    keyword
){

    if(!text){
        return "";
    }

    if(!keyword){
        return escapeHtml(text);
    }

    const escapedKeyword =
        keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const regex =
        new RegExp(
            `(${escapedKeyword})`,
            "gi"
        );

    return escapeHtml(text)
        .replace(
            regex,
            "<mark>$1</mark>"
        );

}

function escapeHtml(text){

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

window.highlightKeyword =
    highlightKeyword;