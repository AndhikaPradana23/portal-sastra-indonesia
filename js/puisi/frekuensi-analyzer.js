function hitungFrekuensiKata(text){

    if(!text.trim()){
        return [];
    }

    const words =
        text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .split(/\s+/)
            .filter(
                word =>
                    word !== ""
            );

    const counter = {};

    words.forEach(word => {

        counter[word] =
            (counter[word] || 0) + 1;

    });

    return Object
        .entries(counter)
        .sort(
            (a, b) =>
                b[1] - a[1]
        );
}

window.hitungFrekuensiKata =
    hitungFrekuensiKata;