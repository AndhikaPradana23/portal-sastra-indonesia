let profileCache = null;

async function getProfile(forceRefresh = false){

    if(
        profileCache &&
        !forceRefresh
    ){

        return profileCache;

    }

    const user =
        await getCurrentUser();

    if(!user){

        profileCache = null;

        return null;

    }

    const {

        data,

        error

    }
    = await supabaseClient

        .from("profiles")

        .select("*")

        .eq(

            "id",

            user.id

        )

        .single();

    if(error){

        console.error(error);

        return null;

    }

    profileCache = data;

    return data;

}

/**
 * Memperbarui data profil pengguna.
 */
async function updateProfile(profileData){

    const user =
        await getCurrentUser();

    if(!user){

        throw new Error(
            "User belum login."
        );

    }

    const {

        data,

        error

    }
    = await supabaseClient

        .from("profiles")

        .update({

            nama_lengkap:
                profileData.namaLengkap,

            username:
                profileData.username,

            no_telp:
                profileData.noTelp,

            tanggal_lahir:
                profileData.tanggalLahir,

            jenis_kelamin:
                profileData.jenisKelamin,

            bio:
                profileData.bio,

            updated_at:
                new Date().toISOString()

        })

        .eq(

            "id",

            user.id

        )

        .select()

        .single();

    if(error){

        throw error;

    }

    profileCache = data;

    return data;

}

/**
 * Memperbarui URL avatar pengguna di tabel profiles.
 */
async function updateAvatar(
    avatarUrl
){

    const user =
        await getCurrentUser();

    const {

        error

    }
    = await supabaseClient

        .from(

            "profiles"

        )

        .update({

            avatar_url:
                avatarUrl

        })

        .eq(

            "id",

            user.id

        );

    if(error){

        throw error;

    }

    await getProfile(
        true
    );

}

/**
 * Memperbarui waktu terakhir aktif pengguna.
 */
async function updateLastSeen(){

    const user =
        await getCurrentUser();

    if(!user){

        return;

    }

    const {

        error

    }
    = await supabaseClient

        .from("profiles")

        .update({

            last_seen_at:
                new Date().toISOString()

        })

        .eq(

            "id",

            user.id

        );

    if(error){

        console.error(error);

    }

    // Refresh cache secara lokal agar data 'last_seen_at' tetap sinkron tanpa fetch ulang
    if(
        profileCache
    ){

        profileCache.last_seen_at =

            new Date().toISOString();

    }

}

function clearProfileCache(){

    profileCache = null;

}

function setProfileCache(profile){

    profileCache = profile;

}

function getCachedProfile(){

    return profileCache;

}

// ==========================================================================
// EXPOSE GLOBAL SERVICE MODULE
// ==========================================================================
window.getProfile =
    getProfile;

window.updateProfile =
    updateProfile;

window.updateAvatar =
    updateAvatar;

window.updateLastSeen =
    updateLastSeen;

window.getCachedProfile =
    getCachedProfile;

window.clearProfileCache =
    clearProfileCache;

window.setProfileCache =
    setProfileCache;