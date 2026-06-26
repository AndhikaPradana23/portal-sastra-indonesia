/**
 * Melindungi rute/halaman yang membutuhkan autentikasi.
 * Memeriksa sesi pengguna, jika tidak ada akan menyimpan pesan ke sessionStorage
 * dan mengalihkan pengguna ke halaman login beserta parameter redirect.
 * @returns {Promise<boolean>} True jika sesi aktif, False jika tidak ada sesi.
 */
async function requireAuth(){

    const session =
        await getSession();

    if(session){

        return true;

    }

    // MENAMBAHKAN: Pesan autentikasi untuk UX yang lebih baik sebelum redirect
    sessionStorage.setItem(
        "authMessage",
        "Silakan masuk terlebih dahulu untuk mengakses halaman ini."
    );

    const currentUrl =
        window.location.pathname;

    const redirect =
        encodeURIComponent(
            currentUrl
        );

    window.location.href =
        `/auth/login.html?redirect=${redirect}`;

    return false;

}

// Daftarkan ke global window agar dapat diakses dari skrip halaman mana pun (bookmark, profile, dll)
window.requireAuth =
    requireAuth;