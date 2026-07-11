async function registerUser({
    namaLengkap,
    username,
    email,
    password,
    noTelp,
    tanggalLahir,
    jenisKelamin
}){

    // ==========================
    // CEK USERNAME
    // ==========================

    const {

        data: existingUser,

        error: usernameError

    }

    = await supabaseClient

        .from("profiles")

        .select("id")

        .eq("username",username)

        .maybeSingle();

    if(usernameError){

        throw usernameError;

    }

    if(existingUser){

        throw new Error(

            "Username sudah digunakan."

        );

    }

    // ==========================
    // REGISTER AUTH
    // ==========================

    const {

        data,

        error

    }

    = await supabaseClient

        .auth

        .signUp({

            email,

            password,

            options:{

                data:{

                    nama_lengkap:
                        namaLengkap,

                    username,

                    no_telp:
                        noTelp,

                    tanggal_lahir:
                        tanggalLahir,

                    jenis_kelamin:
                        jenisKelamin

                }

            }

        });

    if(error){

        throw error;

    }

    return data;

}

/**
 * Langkah 2: Memvalidasi kredensial login pengguna menggunakan email dan password.
 * @param {string} email - Alamat email akun terdaftar
 * @param {string} password - Kata sandi akun
 * @returns {Promise<Object>} Data token session dan user profil jika sukses
 * @throws {Error} Mengembalikan error jika kombinasi email/password salah
 */
async function loginUser(
    email,
    password
){

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    console.log(
        "Login Result:",
        data
    );

    console.log(
        "Login Error:",
        error
    );

    if(error){

        throw error;

    }

    const session =
        await supabaseClient.auth.getSession();

    console.log(
        "Session setelah login:",
        session
    );

    return data;

}

// =========================
// LOGOUT
// =========================

async function logoutUser(){

    try {
        const {
            error
        } =
        await supabaseClient
            .auth
            .signOut();

        if(error){
            // Tangkap dan log alih-alih melempar unhandled error jika session sudah hilang
            console.warn("Logout warning atau session sudah tidak ada:", error.message);
        }
    } 
    catch (error) {
        console.error("Gagal mengeksekusi signOut:", error);
    }

}

// ======================
// SESSION & USER PENGGANTI
// ======================

async function getSession(){

    try {
        const {
            data,
            error
        } =
        await supabaseClient
            .auth
            .getSession();

        if(error){
            console.error("Gagal mendapatkan session:", error);
            return null;
        }

        return data.session;
    } 
    catch (error) {
        return null;
    }

}

/**
 * Mengambil data user yang sedang aktif secara aman melalui session local
 * Mencegah lemparan AuthSessionMissingError ketika user belum log in.
 */
async function getCurrentUser(){

    try {
        const {
            data,
            error
        } =
        await supabaseClient
            .auth
            .getSession();

        if(error){
            console.error("Error pada getSession di getCurrentUser:", error);
            return null;
        }

        // Mengembalikan objek user jika session aktif, atau null jika tidak ada session
        return data.session?.user || null;
    } 
    catch (error) {
        console.error("Exception pada getCurrentUser:", error);
        return null;
    }

}

// ==========================================================================
// EXPOSE GLOBAL SERVICE MODULE
// ==========================================================================
window.AuthService = {
    registerUser,
    loginUser,
    logoutUser,
    getSession,
    getCurrentUser
};

// Pasang juga fungsi langsung ke objek window agar pemanggilan langsung di auth-ui.js tidak rusak
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;