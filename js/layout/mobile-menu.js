function toggleMobileMenu(){

    document
        .body
        .classList
        .toggle(
            "mobile-menu-open"
        );

}

document
    .getElementById(
        "mobile-menu-btn"
    )
    ?.addEventListener(
        "click",
        toggleMobileMenu
    );