async function copyCitation(){

    const result =
        document
        .getElementById(
            "citation-result"
        )
        .textContent
        .trim();

    if(
        !result ||
        result ===
        "Belum ada sitasi."
    ){
        return;
    }

    try{

        await navigator
            .clipboard
            .writeText(
                result
            );

        alert(
            "Sitasi berhasil disalin."
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Gagal menyalin sitasi."
        );

    }

}

// UPDATE: Menambahkan fungsi downloadCitation untuk mengunduh teks sitasi menjadi file .txt
function downloadCitation(){
    const text =
        document
        .getElementById(
            "citation-result"
        )
        .textContent
        .trim();

    if(
        !text ||
        text ===
        "Belum ada sitasi."
    ){
        return;
    }

    const blob =
        new Blob(
            [text],
            {
                type:
                "text/plain"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document
        .createElement("a");

    a.href =
        url;

    a.download =
        "sitasi.txt";

    a.click();

    URL
        .revokeObjectURL(
            url
        );
}

// Mengekspos fungsi ke objek global window agar bisa diakses oleh sitasi/index.js
window.copyCitation = copyCitation;
window.downloadCitation = downloadCitation;