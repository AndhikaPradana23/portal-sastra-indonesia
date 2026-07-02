function updateQuizSEO(){

    const config =
        getQuizConfig();

    if(!config){
        return;
    }

    const kategori =
        config.kategori ||
        "campuran";

    const title =
        `Kuis ${capitalize(kategori)} | Portal Sastra Indonesia`;

    const description =
        `Uji pengetahuan ${kategori} sastra Indonesia melalui kuis interaktif Portal Sastra Indonesia.`;

    document.title =
        title;

    updateMeta(
        "description",
        description
    );

    updateMeta(
        "keywords",
        `
        kuis sastra,
        kuis ${kategori},
        belajar sastra,
        portal sastra
        `
    );

}

function updateMeta(
    name,
    content
){

    let meta =
        document.querySelector(
            `meta[name="${name}"]`
        );

    if(!meta){

        meta =
            document.createElement(
                "meta"
            );

        meta.name =
            name;

        document.head.appendChild(
            meta
        );

    }

    meta.content =
        content;

}

function capitalize(text){

    return text
        .charAt(0)
        .toUpperCase()
        +
        text.slice(1);

}

window.updateQuizSEO =
    updateQuizSEO;