// ========================================
// PROTEKSI LOGIN
// ========================================

document.addEventListener(
"DOMContentLoaded",
async () => {

    const { data } =
        await adminSupabase
        .auth
        .getSession();

    if (!data.session) {

        location.href =
            "login.html";

        return;
    }

    loadKarya();

}
);

// ========================================
// LOAD DATA KARYA
// ========================================

async function loadKarya(
    keyword = ""
) {

    const tbody =
        document.getElementById(
            "karyaTable"
        );

    let query =
        adminSupabase

        .from("karya")

        .select("*");

    if (keyword) {

        query =
            query.ilike(
                "judul",
                `%${keyword}%`
            );
    }

    const {
        data,
        error
    } =
    await query.order(
        "judul",
        {
            ascending: true
        }
    );

    if (error) {

        console.error(error);

        tbody.innerHTML =
        `
        <tr>

            <td colspan="5">

                Gagal memuat data

            </td>

        </tr>
        `;

        return;
    }

    if (!data.length) {

        tbody.innerHTML =
        `
        <tr>

            <td colspan="5">

                Belum ada data karya

            </td>

        </tr>
        `;

        return;
    }

    tbody.innerHTML =
    data.map(item => `

        <tr>

            <td>

                ${escapeHtml(
                    item.judul
                )}

            </td>

            <td>

                ${
                    item.jenis || "-"
                }

            </td>

            <td>

                ${
                    item.tahun || "-"
                }

            </td>

            <td>

                ${
                    item.slug || "-"
                }

            </td>

            <td>

                <button
                    onclick="
                    editKarya(
                    '${item.id}'
                    )
                    "
                >

                    Edit

                </button>

                <button
                    onclick="
                    hapusKarya(
                    '${item.id}'
                    )
                    "
                >

                    Hapus

                </button>

            </td>

        </tr>

    `).join("");

}

// ========================================
// SEARCH
// ========================================

const searchInput =
document.getElementById(
    "search-karya"
);

if (searchInput) {

    searchInput.addEventListener(
    "input",
    function () {

        loadKarya(
            this.value.trim()
        );

    });
}

// ========================================
// TAMBAH
// ========================================

const btnTambah =
document.getElementById(
    "btn-tambah"
);

if (btnTambah) {

    btnTambah.addEventListener(
    "click",
    () => {

        location.href =
            "form-karya-sastra.html";

    });
}

// ========================================
// EDIT
// ========================================

function editKarya(id) {

    location.href =
        `form-karya-sastra.html?id=${id}`;

}

// ========================================
// HAPUS
// ========================================

async function hapusKarya(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus karya ini?"
        );

    if (!yakin) {

        return;
    }

    const { error } =
        await adminSupabase

        .from("karya")

        .delete()

        .eq("id", id);

    if (error) {

        alert(
            error.message
        );

        return;
    }

    loadKarya();

}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}