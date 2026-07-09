// ==========================================
// AVATAR SERVICE
// File:
// js/auth/avatar-service.js
// ==========================================

const AVATAR_BUCKET =
    "avatars";

/**
 * Mengunggah berkas foto profil ke Supabase Storage.
 * @param {File} file - Berkas gambar yang diunggah pengguna.
 * @returns {Promise<string>} URL publik dari foto profil yang berhasil diunggah.
 */
async function uploadAvatar(file){

    const user =
        await getCurrentUser();

    if(!user){

        throw new Error(
            "User belum login."
        );

    }

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const path =
        `${user.id}/avatar.${extension}`;

    const {

        error

    }

    = await supabaseClient

        .storage

        .from(
            AVATAR_BUCKET
        )

        .upload(

            path,

            file,

            {

                upsert:true

            }

        );

    if(error){

        throw error;

    }

    const {

        data

    }

    = supabaseClient

        .storage

        .from(
            AVATAR_BUCKET
        )

        .getPublicUrl(
            path
        );

    return data.publicUrl;

}

/**
 * Memperbarui kolom avatar_url pengguna di tabel profiles.
 * @param {string} avatarUrl - URL publik baru untuk foto profil.
 */
async function updateAvatar(

    avatarUrl

){

    const user =
        await getCurrentUser();

    if(!user){

        throw new Error(
            "User belum login."
        );

    }

    const {

        error

    }

    = await supabaseClient

        .from(
            "profiles"
        )

        .update({

            avatar_url:
                avatarUrl,

            updated_at:
                new Date()
                    .toISOString()

        })

        .eq(

            "id",

            user.id

        );

    if(error){

        throw error;

    }

    if(

        typeof clearProfileCache===

        "function"

    ){

        clearProfileCache();

    }

}

// ==========================================
// EXPORT TO WINDOW OBJECT
// ==========================================
window.uploadAvatar =
    uploadAvatar;

window.updateAvatar =
    updateAvatar;