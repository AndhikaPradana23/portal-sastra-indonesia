async function getProfile(){

    const user =
        await getCurrentUser();

    if(!user){

        return null;

    }

    return {

        id:
            user.id,

        nama:
            user.user_metadata
                ?.nama ||

            "Pengguna",

        email:
            user.email,

        createdAt:
            user.created_at

    };

}

window.getProfile =
    getProfile;