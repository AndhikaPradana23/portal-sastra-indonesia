function ambilLarik(text){

    return text
        .split("\n")
        .map(
            larik =>
                larik.trim()
        )
        .filter(
            larik =>
                larik !== ""
        );

}

// Menggunakan aturan prioritas diftong, kluster khusus, dan vokal terakhir Bahasa Indonesia
function ambilBunyiAkhir(kalimat){

    const kata =
        kalimat
            .toLowerCase()
            .split(/\s+/)
            .pop()
            .replace(
                /[^a-z]/g,
                ""
            );

    if(!kata){
        return "";
    }

    let hasil = "";

    // Prioritas 2: Deteksi variasi diftong spesifik akhiran teks (e.g., merayu -> au)
    if(
        kata.endsWith("ayu")
    ){
        hasil = "au";
    }
    else {
        // Prioritas 1: Pencarian kluster asonansi/konsonansi akhir (termasuk tambahan 'oi')
        const cluster =
            kata.match(
                /(ang|ing|ung|eng|ong|am|an|ar|as|at|au|ai|oi)$/i
            );

        if(cluster){
            hasil =
                cluster[0];
        }
        else{
            // Fallback: Ambil vokal terakhir jika tidak masuk kluster
            const vokal =
                kata.match(
                    /[aiueo](?!.*[aiueo])/i
                );

            hasil =
                vokal
                    ? vokal[0]
                    : kata;
        }
    }

    console.log(
        kata,
        "=>",
        hasil
    );

    return hasil;
}

function buatPolaRima(text){

    const larik =
        ambilLarik(text);

    const mapRima = {};
    const pola = [];

    const kode =
        "abcdefghijklmnopqrstuvwxyz";

    let index = 0;

    larik.forEach(baris => {

        const bunyi =
            ambilBunyiAkhir(
                baris
            );

        if(
            !mapRima[bunyi]
        ){

            mapRima[bunyi] =
                kode[index];

            index++;

        }

        pola.push(
            mapRima[bunyi]
        );

    });

    return {
        pola:
            pola.join(""),
        map:
            mapRima
    };

}

// Mendukung dinamika jumlah larik puisi kontemporer/bebas serta rima tradisional 4 baris
function getJenisRima(pola){

    if(!pola) return "Rima Bebas";

    // Mengecek jumlah variasi bunyi unik di dalam pola rima
    const unik =
        new Set(
            pola.split("")
        ).size;

    // Jika semua baris memiliki bunyi akhir yang sama (e.g., aaa, aaaa)
    if(unik === 1){
        return "Rima Terus";
    }

    // Pola rima spesifik untuk puisi/pantun klasik 4 baris
    if(pola === "abab"){
        return "Rima Silang";
    }

    if(pola === "aabb"){
        return "Rima Berpasangan";
    }

    if(pola === "abba"){
        return "Rima Peluk";
    }

    // Jika strukturnya asimetris atau berjumlah banyak seperti puisi modern
    return "Rima Bebas";
}

window.ambilLarik =
    ambilLarik;

window.ambilBunyiAkhir =
    ambilBunyiAkhir;

window.buatPolaRima =
    buatPolaRima;

window.getJenisRima =
    getJenisRima;