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

    if (!container || !Array.isArray(items) || items.length === 0) {

        return;

    }

    let html = `

        <nav
            class="breadcrumb-card"
            aria-label="Breadcrumb"
        >

            <ol class="breadcrumb-list">

    `;

    items.forEach(

        (

            item,

            index

        ) => {

            const isLast =

                index === items.length - 1;

            html += `

                <li class="breadcrumb-item">

            `;

            // ===========================
            // LINK
            // ===========================

            if (

                !isLast &&

                item.href

            ) {

                html += `

                    <a href="${item.href}">

                        ${

                            item.icon

                                ?

                                `<img
                                    src="${item.icon}"
                                    class="breadcrumb-icon"
                                    alt=""
                                >`

                                :

                                ""

                        }

                        <span>

                            ${item.label}

                        </span>

                    </a>

                    <img
                        src="/assets/icons/chevron-right.svg"
                        class="breadcrumb-separator"
                        alt=""
                    >

                `;

            }

            // ===========================
            // CURRENT PAGE
            // ===========================

            else {

                html += `

                    <span class="breadcrumb-current">

                        ${

                            item.icon

                                ?

                                `<img
                                    src="${item.icon}"
                                    class="breadcrumb-icon"
                                    alt=""
                                >`

                                :

                                ""

                        }

                        ${item.label}

                    </span>

                `;

            }

            html += `

                </li>

            `;

        }

    );

    html += `

            </ol>

        </nav>

    `;

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