// ====================================
// HOME CARD RENDERER
// ====================================

function renderHomeCard({

    badge,

    title,

    description,

    url,

    buttonText

}){

    return `

        <article class="home-card">

            <span class="card-badge">

                ${escapeHtml(badge)}

            </span>

            <h3>

                <a href="${url}">

                    ${escapeHtml(title)}

                </a>

            </h3>

            <p>

                ${potongTeks(description,140)}

            </p>

            <a

                class="home-link"

                href="${url}"

            >

                ${buttonText}

            </a>

        </article>

    `;

}