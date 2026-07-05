function renderHeroSearch() {

    document
        .getElementById(
            "search-section"
        )
        .innerHTML = `
            <div class="container">

                <div class="home-search card">

                    <h2>

                        Cari Apa Saja

                    </h2>

                    <form
                        action="/search/"
                    >

                        <input
                            class="input"
                            name="q"
                            placeholder="
                            Cari istilah,
                            sastrawan,
                            karya,
                            artikel...
                            "
                        >

                    </form>

                </div>

            </div>
        `;
}

window.renderHeroSearch = renderHeroSearch;

function initHeroSearch(){

    initGlobalSearch({

        input:
            "#hero-search",

        autocomplete:
            "#hero-autocomplete"

    });

    const input =
        document.getElementById(
            "hero-search"
        );

    input.addEventListener(
        "keydown",
        event => {

            if(
                event.key !==
                "Enter"
            ){
                return;
            }

            const keyword =
                input.value.trim();

            if(
                !keyword
            ){
                return;
            }

            window.location.href =
                `/search/index.html?q=${encodeURIComponent(keyword)}`;

        }
    );

    // Langkah 6: Tambahkan tombol search
    const button =
        document.getElementById(
            "hero-search-btn"
        );

    button?.addEventListener(
        "click",
        () => {

            const keyword =
                input.value.trim();

            if(
                !keyword
            ){
                return;
            }

            window.location.href =
                `/search/index.html?q=${encodeURIComponent(keyword)}`;

        }
    );

    // Langkah 7: Tambahkan suggestion ketika input kosong
    input.addEventListener(
        "focus",
        async () => {

            if(
                input.value.trim()
            ){
                return;
            }

            const items =
                await PopularSearchService
                    .getPopularSearches();

            const container =
                document.getElementById(
                    "hero-autocomplete"
                );

            container.innerHTML =
                items
                    .slice(0, 5)
                    .map(item => `

                        <div
                            class="autocomplete-item"
                            data-keyword="${item.keyword}"
                        >

                            🔥
                            ${item.keyword}

                        </div>

                    `)
                    .join("");

        }
    );

    // Langkah 8: Klik suggestion
    document
    .getElementById(
        "hero-autocomplete"
    )
    ?.addEventListener(
        "click",
        event => {

            const item =
                event.target.closest(
                    ".autocomplete-item"
                );

            if(
                !item
            ){
                return;
            }

            const keyword =
                item.dataset.keyword;

            window.location.href =
                `/search/index.html?q=${encodeURIComponent(keyword)}`;

        }
    );

}