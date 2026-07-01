/**
 * js/puisi/majas-detector.js
 * 
 * Modul untuk mendeteksi keberadaan majas di dalam teks puisi.
 * Bergantung pada objek global 'MAJAS_PATTERNS' untuk deteksi berbasis kamus kata.
 */

// LANGKAH 3: Detektor khusus untuk majas Repetisi
function detectRepetisi(text){

    const kata =
        text
            .toLowerCase()
            .match(/[a-z]+/g);

    if(!kata){
        return null;
    }

    const hitung = {};

    kata.forEach(item => {

        hitung[item] =
            (hitung[item] || 0)
            + 1;

    });

    const hasil =
        Object.entries(
            hitung
        )
        .find(
            ([, total]) =>
                total >= 3
        );

    if(
        !hasil
    ){
        return null;
    }

    return {

        nama:
            "repetisi",

        indikator:
            hasil[0]

    };

}


// LANGKAH 2 & 4: Fungsi utama deteksi majas
function detectMajas(text){

    const hasil = [];

    const lower =
        text.toLowerCase();

    // Memeriksa majas berdasarkan pola kata yang ada di MAJAS_PATTERNS
    Object.entries(
        MAJAS_PATTERNS
    )
    .forEach(([nama, daftar]) => {

        // Lewati repetisi di sini karena memiliki logika hitung tersendiri di bawah
        if(
            nama === "repetisi"
        ){
            return;
        }

        const ditemukan =
            daftar.find(
                kata =>
                    lower.includes(
                        kata
                    )
            );

        if(
            ditemukan
        ){

            hasil.push({

                nama,

                indikator:
                    ditemukan

            });

        }

    });

    // LANGKAH 4: Gabungkan deteksi repetisi ke dalam hasil akhir
    const repetisi =
        detectRepetisi(
            text
        );

    if(
        repetisi
    ){
        hasil.push(
            repetisi
        );
    }

    return hasil;

}

// Mendaftarkan fungsi ke dalam scope global window agar bisa diakses modul lain
window.detectRepetisi = detectRepetisi;
window.detectMajas = detectMajas;