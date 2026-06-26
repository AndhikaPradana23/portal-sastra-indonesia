function getRedirectUrl(){

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get(
            "redirect"
        ) ||
        "/index.html"
    );

}

window.getRedirectUrl =
    getRedirectUrl;