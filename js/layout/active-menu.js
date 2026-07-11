let activeMenuInitialized = false;

// ======================================================

function initActiveMenu() {

    if (

        activeMenuInitialized

    ) {

        return;

    }

    activeMenuInitialized = true;

    const currentPath =

        normalizePath(

            location.pathname

        );

    const menuLinks =

        document.querySelectorAll(

            ".main-nav > a, .main-nav .dropdown-menu a"

        );

    menuLinks.forEach(link => {

        const href =

            normalizePath(

                new URL(

                    link.href,

                    location.origin

                ).pathname

            );

        if (

            currentPath === href ||

            (

                href !== "/" &&

                currentPath.startsWith(

                    href

                )

            )

        ) {

            link.classList.add(

                "active"

            );

        }

    });

}

// ======================================================

function normalizePath(path) {

    if (

        path.length > 1 &&

        path.endsWith("/")

    ) {

        return path.slice(

            0,

            -1

        );

    }

    return path;

}

// ======================================================

window.initActiveMenu =
    initActiveMenu;