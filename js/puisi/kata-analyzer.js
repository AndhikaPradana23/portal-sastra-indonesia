function hitungKata(text){

    if(!text.trim()){
        return 0;
    }

    const words =
        text
            .trim()
            .split(/\s+/)
            .filter(
                word =>
                    word !== ""
            );

    return words.length;
}

window.hitungKata =
    hitungKata;