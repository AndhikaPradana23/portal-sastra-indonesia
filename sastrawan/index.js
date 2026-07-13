let hurufAktif = "";
let angkatanAktif = "";
let jenisAktif = "";

// ==========================
// LOAD DATA
// ==========================

async function loadSastrawan(
    keyword = "",
    huruf = "",
    angkatan = "",
    jenis = ""
) {

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("sastrawanList");

    try {

        loading.style.display = "block";

        let query =
            supabaseClient
            .from("sastrawan")
            .select("*");

        if(keyword){

            query =
                query.ilike(
                    "nama",
                    `%${keyword}%`
                );
        }

        if(huruf){

            query =
                query.ilike(
                    "nama",
                    `${huruf}%`
                );
        }

        if(angkatan){

            query =
                query.eq(
                    "angkatan",
                    angkatan
                );
        }

        if (jenis) {

            query =
                query.contains(
                    "jenis",
                    [jenis]
                );
        }

        const { data, error } =
            await query.order(
                "nama",
                { ascending:true }
            );

        loading.style.display =
            "none";

        if(error){

            throw error;
        }

        if(!data.length){

            container.innerHTML = `
                <div class="empty">

                    Data tidak ditemukan

                </div>
            `;

            return;
        }

        container.innerHTML =
            data.map(item => `

            <article class="sastrawan-card">

                ${
                    item.foto
                    ?

                    `<img
                        src="${item.foto}"
                        alt="${item.nama}"
                        class="sastrawan-thumb"
                    >`

                    :

                    ""
                }

                <div class="card-content">

                    <h2>

                        <a href="
                        detail.html?slug=${item.slug}
                        ">

                            ${escapeHtml(item.nama)}

                        </a>

                    </h2>

                    <p>

                        <strong>Angkatan:</strong>

                        ${escapeHtml(
                            item.angkatan || "-"
                        )}

                    </p>

                    <p>

                        <strong>Jenis:</strong>

                        ${
                            Array.isArray(item.jenis)
                            ? escapeHtml(item.jenis.join(", "))
                            : "-"
                        }

                    </p>

                    <p>

                        ${escapeHtml(
                            potongTeks(
                                item.biografi_singkat || "",
                                180
                            )
                        )}

                    </p>

                </div>

            </article>

        `).join("");

    } catch(error){

        console.error(error);

        container.innerHTML =
        `
        <div class="error">

            Gagal memuat data

        </div>
        `;
    }
}

// ==========================
// HELPER
// ==========================

function potongTeks(teks, panjang){

    if(!teks) return "";

    if(teks.length <= panjang){

        return teks;
    }

    return teks.substring(
        0,
        panjang
    ) + "...";
}

function escapeHtml(text){

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;
}

// ==========================
// A-Z
// ==========================

const azContainer =
document.getElementById(
    "az-filter"
);

if(azContainer){

    const huruf =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("");

    azContainer.innerHTML +=
    huruf.map(h => `

        <button
            class="az-btn"
            data-huruf="${h}"
        >

            ${h}

        </button>

     `).join("");
}

// ==========================
// EVENT
// ==========================

document.addEventListener(
"input",
(event)=>{

    if(
        event.target.id ===
        "search-input"
    ){

        loadSastrawan(
            event.target.value,
            hurufAktif,
            angkatanAktif,
            jenisAktif
        );
    }
});

document.addEventListener(
"click",
(event)=>{

    if(
        event.target.classList.contains(
            "az-btn"
        )
    ){

        document
        .querySelectorAll(".az-btn")
        .forEach(btn =>
            btn.classList.remove("aktif")
        );

        event.target.classList.add(
            "aktif"
        );

        hurufAktif =
            event.target.dataset.huruf;

        loadSastrawan(
            document.getElementById(
                "search-input"
            ).value,
            hurufAktif,
            angkatanAktif,
            jenisAktif
        );
    }
});

document.addEventListener(
"click",
(event)=>{

    if(
        event.target.classList.contains(
            "angkatan-btn"
        )
    ){

        document
        .querySelectorAll(
            ".angkatan-btn"
        )
        .forEach(btn =>
            btn.classList.remove("aktif")
        );

        event.target.classList.add(
            "aktif"
        );

        angkatanAktif =
            event.target.dataset.angkatan;

        loadSastrawan(
            document.getElementById(
                "search-input"
            ).value,
            hurufAktif,
            angkatanAktif,
            jenisAktif
        );
    }
});

document.addEventListener(
    "click",
    (event) => {

        if (
            event.target.classList.contains(
                "jenis-btn"
            )
        ) {

            document
                .querySelectorAll(
                    ".jenis-btn"
                )
                .forEach(btn =>
                    btn.classList.remove(
                        "aktif"
                    )
                );

            event.target.classList.add(
                "aktif"
            );

            jenisAktif =
                event.target.dataset.jenis;

            loadSastrawan(
                document.getElementById(
                    "search-input"
                ).value,
                hurufAktif,
                angkatanAktif,
                jenisAktif
            );

        }

    }
);

// UBAHAN LANGKAH 6: Memuat Layout Terlebih Dahulu Sebelum Fungsi Halaman Sastrawan Dijalankan
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memuat layout utama terlebih dahulu
        await loadLayout();

        // Panggil fungsi global renderBreadcrumb untuk halaman Sastrawan
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Sastrawan",
                icon: "/assets/icons/user-round.svg"
            }
        ]);

        updateSEO();

        loadSastrawan();
    }
);

// ==========================================
// SEO HALAMAN DAFTAR SASTRAWAN
// ==========================================

function updateSEO(){

    const title =
    "Database Sastrawan Indonesia | Portal Sastra Indonesia";

    const description =
    "Ensiklopedia sastrawan Indonesia berisi biografi, karya sastra, penghargaan, referensi akademik, artikel, serta tokoh sastra dari berbagai angkatan.";

    document.title =
    title;

    document
    .getElementById(
        "meta-description"
    )
    .content =
    description;

    document
    .getElementById(
        "canonical-url"
    )
    .href =
    window.location.href;

    document
    .getElementById(
        "og-title"
    )
    .content =
    title;

    document
    .getElementById(
        "og-description"
    )
    .content =
    description;

    document
    .getElementById(
        "og-url"
    )
    .content =
    window.location.href;

    document
    .getElementById(
        "twitter-title"
    )
    .content =
    title;

    document
    .getElementById(
        "twitter-description"
    )
    .content =
    description;

}