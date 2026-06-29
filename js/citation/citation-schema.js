function updateCitationSchema(){

    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "WebApplication",

        name:
            "Generator Sitasi",

        applicationCategory:
            "EducationalApplication",

        operatingSystem:
            "Any",

        description:
            "Generator sitasi APA, MLA, Chicago, dan Harvard.",

        url:
            window.location.href

    };

    document
        .getElementById(
            "jsonld-schema"
        )
        .textContent =
        JSON.stringify(
            schema,
            null,
            2
        );

}