function getPembahasan(
    item
){

    if(
        item.type ===
        "istilah"
    ){

        return `
            Definisi yang benar adalah:
            ${item.correct}
        `;

    }

    if(
        item.type ===
        "sastrawan"
    ){

        return `
            Penulis yang benar adalah:
            ${item.correct}
        `;

    }

    if(
        item.type ===
        "karya"
    ){

        return `
            Karya tersebut ditulis oleh:
            ${item.correct}
        `;

    }

    return "";
}

window.getPembahasan =
    getPembahasan;