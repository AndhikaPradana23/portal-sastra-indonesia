function openCitationPage(data){

    sessionStorage.setItem(
        "citationDraft",
        JSON.stringify(data)
    );

    window.location.href =
        "/sitasi/index.html";

}