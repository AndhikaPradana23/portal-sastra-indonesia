/**
 * ==========================================================
 * SESSION SERVICE
 * ==========================================================
 */

async function getSession(){

    const {

        data,

        error

    } =
    await supabaseClient.auth.getSession();

    if(error){

        console.error(
            "Get Session:",
            error
        );

        return null;

    }

    return data.session;

}

/**
 * ==========================================================
 */

async function getCurrentUser(){

    const session =
        await getSession();

    return session
        ? session.user
        : null;

}

/**
 * ==========================================================
 */

window.getSession =
    getSession;

window.getCurrentUser =
    getCurrentUser;