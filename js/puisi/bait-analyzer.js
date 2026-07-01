function hitungBait(text){

    if(!text.trim()){
        return 0;
    }

    const bait =
        text
            .trim()
            .split(/\n\s*\n/);

    return bait.length;
}

window.hitungBait =
    hitungBait;