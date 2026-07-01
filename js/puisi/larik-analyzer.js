function hitungLarik(text){

    if(!text.trim()){
        return 0;
    }

    const lines =
        text
            .split("\n")
            .filter(
                line =>
                    line.trim() !== ""
            );

    return lines.length;
}

window.hitungLarik =
    hitungLarik;