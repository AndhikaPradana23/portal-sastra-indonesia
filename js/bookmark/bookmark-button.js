// =====================================
// BOOKMARK BUTTON
// =====================================

/**
 * Menginisialisasi tombol bookmark di halaman detail konten.
 * Mencegat user yang belum login dan mengarahkan ke halaman login.
 * @param {Object} item - Objek konten (harus memiliki properti .tipe dan .id/.item_id)
 */
async function initBookmarkButton(item){

    const button =
        document.getElementById(
            "bookmark-button"
        );

    if(!button){
        return;
    }

    const idKonten = item.id || item.item_id;

    // ==================================================
    // VALIDASI ID KONTEN AGAR HALAMAN TIDAK RUSAK
    // ==================================================
    if(!idKonten){

        console.error(
            "Bookmark gagal diinisialisasi.",
            item
        );

        button.disabled = true;
        button.innerHTML =
            "Bookmark Error";

        return;

    }

    // Sinkronisasi status awal tombol (apakah sudah di-bookmark atau belum)
    // Menggunakan BookmarkService yang sudah diekspos ke global window
    const statusAwal = 
        typeof window.BookmarkService?.isBookmarked === "function"
            ? await window.BookmarkService.isBookmarked(item.tipe, idKonten)
            : false;

    updateBookmarkButton(
        button,
        statusAwal
    );

    button.type = "button";

    button.onclick = async () => {
        
        // --- LANGKAH 3: CEK PROTEKSI SESI USER ---
        // Memastikan fungsi getSession tersedia secara global
        if (typeof window.getSession === "function") {
            const session = await window.getSession();

            if(!session){
                // UX Tambahan: Berikan pesan ramah di sessionStorage sebelum dilempar
                sessionStorage.setItem(
                    "authMessage",
                    "Silakan masuk terlebih dahulu untuk menyimpan bookmark."
                );

                // Redirect ke login dengan membawa halaman asal secara dinamis
                window.location.href =
                    "/auth/login.html?redirect=" +
                    encodeURIComponent(
                        window.location.pathname + window.location.search
                    );
                return;
            }
        }

        // ==================================================================
        // PERBAIKAN BUG: Mengirim parameter spesifik (tipe, idKonten)
        // ==================================================================
        if (typeof window.BookmarkService?.toggleBookmark === "function") {
            const bookmarked =
                await window.BookmarkService.toggleBookmark(
                    item.tipe,
                    idKonten
                );

            updateBookmarkButton(
                button,
                bookmarked
            );
        }

        // ----------------------------------------------------------------------
        // LANGKAH 6: Auto Update Count Jika Fungsi Renderer Tersedia di Halaman
        // ----------------------------------------------------------------------
        if(
            typeof renderBookmarkCount ===
            "function"
        ){
            renderBookmarkCount();
        }
    };

}

/**
 * Mengubah visual (style & teks) tombol bookmark berdasarkan statusnya.
 */
function updateBookmarkButton(
    button,
    bookmarked
) {

    button.classList.add(
        "btn",
        "bookmark-btn"
    );

    if (bookmarked) {

        button.classList.remove("btn-outline");
        button.classList.add("btn-primary");
        button.classList.add("bookmarked");

        button.innerHTML = `
            <img
                src="/assets/icons/bookmark-check.svg"
                class="btn-icon"
                alt=""
            >
            <span>Disimpan</span>
        `;

    } else {

        button.classList.remove("btn-primary");
        button.classList.add("btn-outline");
        button.classList.remove("bookmarked");

        button.innerHTML = `
            <img
                src="/assets/icons/bookmark.svg"
                class="btn-icon"
                alt=""
            >
            <span>Simpan</span>
        `;

    }

}