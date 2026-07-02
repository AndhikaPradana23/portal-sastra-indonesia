function renderQuizSchema(){

    const config =
        getQuizConfig();

    if(!config){
        return;
    }

    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "Quiz",

        name:
            `Kuis ${config.kategori}`,

        description:
            `Kuis interaktif ${config.kategori} sastra Indonesia.`,

        educationalLevel:
            "Beginner",

        inLanguage:
            "id-ID",

        publisher: {

            "@type":
                "Organization",

            name:
                "Portal Sastra Indonesia"

        }

    };

    const script =
        document.createElement(
            "script"
        );

    script.type =
        "application/ld+json";

    script.textContent =
        JSON.stringify(schema);

    document.head.appendChild(
        script
    );

}

window.renderQuizSchema =
    renderQuizSchema;