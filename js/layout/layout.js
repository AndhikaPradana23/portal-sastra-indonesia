let layoutInitialized = false;

// ======================================================
// LOAD COMPONENT
// ======================================================

async function loadComponent(
    selector,
    file
) {

    const element =
        document.querySelector(
            selector
        );

    if (!element) {

        return;

    }

    try {

        const response =
            await fetch(file);

        if (!response.ok) {

            throw new Error(

                `Gagal memuat ${file}`

            );

        }

        element.innerHTML =
            await response.text();

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================================
// LOAD LAYOUT
// ======================================================

async function loadLayout() {

    if (layoutInitialized) {

        return;

    }

    layoutInitialized = true;

    // ==========================================
    // HEADER + FOOTER
    // ==========================================

    await Promise.all([

        loadComponent(
            "#site-header",
            "/components/header.html"
        ),

        loadComponent(
            "#site-footer",
            "/components/footer.html"
        )

    ]);

    // ==========================================
    // ACTIVE MENU
    // ==========================================

    if (

        typeof window.initActiveMenu ===

        "function"

    ) {

        window.initActiveMenu();

    }

    // ==========================================
    // MOBILE MENU
    // ==========================================

    if (

        typeof window.initMobileMenu ===

        "function"

    ) {

        window.initMobileMenu();

    }

    // ==========================================
    // AUTH UI
    // ==========================================

    try {

        if (

            typeof window.initAuthUI ===

            "function"

        ) {

            await window.initAuthUI();

        }

    }

    catch (error) {

        console.error(

            "Auth UI:",

            error

        );

    }

    // ==========================================
    // UPDATE LAST SEEN
    // ==========================================

    try {

        if (

            typeof window.updateLastSeen ===

            "function"

        ) {

            await window.updateLastSeen();

        }

    }

    catch (error) {

        console.error(error);

    }

    // ==========================================
    // USER PREFERENCES
    // ==========================================

    try {

        if (

            window.PreferencesService

        ) {

            await window
                .PreferencesService
                .applyPreferences();

        }

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================================
// BREADCRUMB
// ======================================================

function renderBreadcrumb(items) {

    const container =
        document.getElementById(
            "breadcrumb"
        );

    if (!container) {

        return;

    }

    let html =
        `<nav class="breadcrumb"><ol>`;

    items.forEach(

        (

            item,

            index

        ) => {

            const isLast =

                index ===

                items.length - 1;

            if (

                isLast ||

                !item.href

            ) {

                html += `

<li>

<span>

${item.label}

</span>

</li>

`;

            }

            else {

                html += `

<li>

<a href="${item.href}">

${item.label}

</a>

</li>

`;

            }

        }

    );

    html +=

        `</ol></nav>`;

    container.innerHTML =

        html;

}

// ======================================================

window.loadLayout =
    loadLayout;

window.renderBreadcrumb =
    renderBreadcrumb;

// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    loadLayout

);