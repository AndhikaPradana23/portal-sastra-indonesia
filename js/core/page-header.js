function createPageHeader(
    title,
    description
) {

    return `
        <div class="page-header">

            <h1>

                ${title}

            </h1>

            <p
                class="
                page-description
                "
            >

                ${description}

            </p>

        </div>
    `;
}

window.createPageHeader =
    createPageHeader;