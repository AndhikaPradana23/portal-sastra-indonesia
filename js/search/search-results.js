// ==========================================================================
// MAIN RENDER FUNCTION
// ==========================================================================
function renderSearchPage(
    keyword,
    data
) {

    const title =
        document.getElementById(
            "search-title"
        );

    const total =
        document.getElementById(
            "search-total"
        );

    const container =
        document.getElementById(
            "search-results"
        );

    const jumlah =
        data.istilah.length +
        data.artikel.length +
        data.karya.length +
        data.sastrawan.length;

    // INTEGRASI LANGKAH 8: Panggil engine SEO saat hasil pencarian muncul
    if (
        typeof updateSearchSEO ===
        "function"
    ) {
        updateSearchSEO(
            keyword,
            jumlah
        );
    }

    title.textContent =
        `Hasil untuk "${keyword}"`;

    total.textContent =
        `${jumlah} hasil ditemukan`;

    if (jumlah === 0) {
        container.innerHTML = `
            <div class="empty-search">
                <h3>
                    Tidak ada hasil
                </h3>
                <p>
                    Coba kata kunci lain.
                </p>
            </div>
        `;
        return;
    }

    const groups =
        createSearchGroups(
            data
        );

    // Menghapus penggunaan keywordAktif global, mengalirkan langsung dari parameter
    container.innerHTML =
        groups
            .map(group =>
                renderGroup(
                    group,
                    keyword
                )
            )
            .join("");

    initGroupToggle();
}

// ==========================================================================
// GROUP RENDERER & HELPER FUNCTIONS
// ==========================================================================
function createSearchGroups(data) {
    return [
        {
            id: "group-istilah",
            title: "Istilah",
            icon: "📖",
            items: data.istilah,
            field: "nama",
            url: "/kamus-istilah/detail.html?slug="
        },
        {
            id: "group-sastrawan",
            title: "Sastrawan",
            icon: "✍️",
            items: data.sastrawan,
            field: "nama",
            url: "/sastrawan/detail.html?slug="
        },
        {
            id: "group-karya",
            title: "Karya Sastra",
            icon: "📚",
            items: data.karya,
            field: "judul",
            url: "/karya-sastra/detail.html?slug="
        },
        {
            id: "group-artikel",
            title: "Artikel",
            icon: "📰",
            items: data.artikel,
            field: "judul",
            url: "/artikel/detail.html?slug="
        }
    ];
}

function renderGroup(
    group,
    keyword
) {

    if (
        !group.items ||
        group.items.length === 0
    ) {
        return "";
    }

    return `
        <section
            class="search-group"
        >

            <button
                class="group-header"
                data-group="${group.id}"
            >

                <span>

                    ${group.icon}
                    ${group.title}
                    (${group.items.length})

                </span>

                <span
                    id="icon-${group.id}"
                >
                    ▼
                </span>

            </button>

            <div
                class="group-content"
                id="${group.id}"
            >

                <div
                    class="search-grid"
                >

                    ${group.items
                        .map(item => `
                            <a
                                class="search-card"
                                href="${group.url}${item.slug}"
                            >

                                <h3>
                                    ${
                                        window.highlightKeyword(
                                            item[
                                                group.field
                                            ],
                                            keyword
                                        )
                                    }
                                </h3>

                            </a>
                        `)
                        .join("")}

                </div>

            </div>

        </section>
    `;
}

// ==========================================================================
// COLLAPSE GROUP TOGGLE
// ==========================================================================
function initGroupToggle() {

    document
        .querySelectorAll(
            ".group-header"
        )
        .forEach(button => {

            button.onclick =
                () => {

                    const id =
                        button.dataset.group;

                    const content =
                        document.getElementById(
                            id
                        );

                    const icon =
                        document.getElementById(
                            `icon-${id}`
                        );

                    const hidden =
                        content.classList.toggle(
                            "collapsed"
                        );

                    icon.textContent =
                        hidden
                            ? "▶"
                            : "▼";

                };

        });

}

window.initGroupToggle =
    initGroupToggle;