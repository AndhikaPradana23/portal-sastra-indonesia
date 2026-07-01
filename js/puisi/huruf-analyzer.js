function hitungHuruf(text){

    const counter = {};

    const letters =
        text
            .toLowerCase()
            .replace(
                /[^a-z]/g,
                ""
            )
            .split("");

    letters.forEach(letter => {

        counter[letter] =
            (counter[letter] || 0) + 1;

    });

    return counter;
}

function getDominanHuruf(counter){

    const entries =
        Object.entries(counter);

    if(!entries.length){
        return null;
    }

    return entries.sort(
        (a, b) =>
            b[1] - a[1]
    )[0];
}

function hitungVokal(text){

    const counter = {
        a:0,
        i:0,
        u:0,
        e:0,
        o:0
    };

    const letters =
        text
            .toLowerCase()
            .replace(
                /[^a-z]/g,
                ""
            )
            .split("");

    letters.forEach(letter => {

        if(
            counter.hasOwnProperty(
                letter
            )
        ){
            counter[letter]++;
        }

    });

    return counter;
}

function getDominanVokal(counter){

    return Object
        .entries(counter)
        .sort(
            (a, b) =>
                b[1] - a[1]
        )[0];
}

window.hitungHuruf =
    hitungHuruf;

window.getDominanHuruf =
    getDominanHuruf;

window.hitungVokal =
    hitungVokal;

window.getDominanVokal =
    getDominanVokal;