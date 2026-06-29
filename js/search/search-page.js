function getSearchKeyword(){

    const params =
        new URLSearchParams(
            location.search
        );

    return (
        params.get("q") ||
        ""
    ).trim();

}

window.getSearchKeyword =
    getSearchKeyword;