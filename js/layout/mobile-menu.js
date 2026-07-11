let mobileMenuInitialized = false;

/* ==========================================
   MOBILE DRAWER
========================================== */

function openMobileMenu() {

    document.body.classList.add(
        "mobile-menu-open"
    );

    document.body.style.overflow = "hidden";

}

function closeMobileMenu() {

    document.body.classList.remove(
        "mobile-menu-open"
    );

    document.body.style.overflow = "";

}

function toggleMobileMenu(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }

    if (

        document.body.classList.contains(
            "mobile-menu-open"
        )

    ) {

        closeMobileMenu();

    }

    else {

        openMobileMenu();

    }

}

/* ==========================================
   DESKTOP TOOLS DROPDOWN
========================================== */

function initToolsDropdown() {

    const dropdown =
        document.querySelector(
            ".header-tools"
        );

    const button =
        dropdown?.querySelector(
            ".dropdown-toggle"
        );

    if (

        !dropdown ||

        !button

    ) {

        return;

    }

    button.addEventListener(

        "click",

        function (event) {

            event.preventDefault();

            event.stopPropagation();

            dropdown.classList.toggle(
                "open"
            );

        }

    );

    dropdown.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();

        }

    );

    document.addEventListener(

        "click",

        function () {

            dropdown.classList.remove(
                "open"
            );

        }

    );

}

/* ==========================================
   DRAWER EVENTS
========================================== */

function initDrawerEvents() {

    const button =
        document.getElementById(
            "mobile-menu-btn"
        );

    const closeButton =
        document.getElementById(
            "mobile-close-btn"
        );

    const overlay =
        document.getElementById(
            "mobile-menu-overlay"
        );

    const drawer =
        document.getElementById(
            "mobile-drawer"
        );

    if (

        !button ||

        !drawer ||

        !overlay

    ) {

        return;

    }

    /* ===============================
       OPEN
    =============================== */

    button.addEventListener(

        "click",

        toggleMobileMenu

    );

    /* ===============================
       CLOSE BUTTON
    =============================== */

    closeButton?.addEventListener(

        "click",

        closeMobileMenu

    );

    /* ===============================
       OVERLAY
    =============================== */

    overlay.addEventListener(

        "click",

        closeMobileMenu

    );

    /* ===============================
       CLICK MENU
    =============================== */

    drawer

        .querySelectorAll("a")

        .forEach(link => {

            link.addEventListener(

                "click",

                closeMobileMenu

            );

        });

    /* ===============================
       STOP PROPAGATION
    =============================== */

    drawer.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();

        }

    );

    /* ===============================
       ESC
    =============================== */

    document.addEventListener(

        "keydown",

        function (event) {

            if (

                event.key !== "Escape"

            ) {

                return;

            }

            closeMobileMenu();

            document

                .querySelector(

                    ".header-tools"

                )

                ?.classList.remove(

                    "open"

                );

        }

    );

}

/* ==========================================
   OPTIONAL SWIPE CLOSE
========================================== */

function initSwipeClose() {

    const drawer =
        document.getElementById(
            "mobile-drawer"
        );

    if (!drawer) {

        return;

    }

    let startX = 0;

    drawer.addEventListener(

        "touchstart",

        function (event) {

            startX =
                event.touches[0].clientX;

        },

        {

            passive: true

        }

    );

    drawer.addEventListener(

        "touchend",

        function (event) {

            const endX =
                event.changedTouches[0].clientX;

            if (

                endX - startX >

                80

            ) {

                closeMobileMenu();

            }

        },

        {

            passive: true

        }

    );

}

/* ==========================================
   INIT
========================================== */

function initMobileMenu() {

    if (

        mobileMenuInitialized

    ) {

        return;

    }

    mobileMenuInitialized = true;

    initToolsDropdown();

    initDrawerEvents();

    initSwipeClose();

}

/* ==========================================
   EXPORT
========================================== */

window.initMobileMenu =
    initMobileMenu;

window.openMobileMenu =
    openMobileMenu;

window.closeMobileMenu =
    closeMobileMenu;