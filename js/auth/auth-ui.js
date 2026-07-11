let authListenerInitialized = false;

window.initAuthUI = initAuthUI;

/* ==========================================================
   INIT
========================================================== */

async function initAuthUI() {

    await updateAuthMenu();

    if (authListenerInitialized) {

        return;

    }

    authListenerInitialized = true;

    supabaseClient.auth.onAuthStateChange(

        async () => {

            await updateAuthMenu();

        }

    );

}

/* ==========================================================
   UPDATE AUTH UI
========================================================== */

async function updateAuthMenu() {

    const desktopMenu =
        document.getElementById(
            "auth-menu"
        );

    const mobileMenu =
        document.getElementById(
            "mobile-auth-menu"
        );

    if (!desktopMenu) {

        return;

    }

    const user =
        await getCurrentUser();

    /* ======================================================
       BELUM LOGIN
    ====================================================== */

    if (!user) {

        desktopMenu.innerHTML = `
<a
href="/auth/login.html"
class="btn btn-primary"
>
<img
src="/assets/icons/log-in.svg"
class="btn-icon"
alt=""
>
<span>Masuk</span>
</a>
`;

        if (mobileMenu) {

            mobileMenu.innerHTML = `
<a href="/auth/login.html">

<img
src="/assets/icons/log-in.svg"
class="menu-icon"
alt=""
>

<span>

Masuk

</span>

</a>

<a href="/auth/register.html">

<img
src="/assets/icons/user-plus.svg"
class="menu-icon"
alt=""
>

<span>

Daftar

</span>

</a>
`;

        }

        return;

    }

    /* ======================================================
       PROFILE
    ====================================================== */

    const profile =
        await getProfile();

    if (!profile) {

        desktopMenu.innerHTML = `
<a
href="/profile/"
class="btn btn-outline"
>

Profil

</a>
`;

        return;

    }

    const nama =
        profile.nama_lengkap ||
        "Pengguna";

    const role =
        profile.role ||
        "User";

    const safeNama =

        typeof window.escapeHtml ===
        "function"

        ? window.escapeHtml(nama)

        : nama;

    let avatar =
        profile.avatar_url;

    if (!avatar) {

        avatar =
            "/assets/images/default-avatar.png";

    }

    /* ======================================================
       DESKTOP
    ====================================================== */

    desktopMenu.innerHTML = `

<div class="auth-dropdown">

<button

id="account-button"

class="account-button"

type="button"

>

<img

src="${avatar}"

class="user-avatar"

alt="${safeNama}"

onerror="this.src='/assets/images/default-avatar.png'"

>

<div class="auth-user-info">

<strong>

${safeNama}

</strong>

<span>

${role}

</span>

</div>

<img

src="/assets/icons/chevron-down.svg"

class="account-arrow"

alt=""

>

</button>

<div class="dropdown-menu">

<a href="/profile/">

<img

src="/assets/icons/user.svg"

alt=""

>

<span>

Profil Saya

</span>

</a>

<a href="/bookmark/">

<img

src="/assets/icons/bookmark.svg"

alt=""

>

<span>

Bookmark

</span>

</a>

<a href="/profile/settings.html">

<img

src="/assets/icons/settings.svg"

alt=""

>

<span>

Pengaturan

</span>

</a>

<a href="/profile/preferences.html">

<img

src="/assets/icons/sliders-horizontal.svg"

alt=""

>

<span>

Preferensi

</span>

</a>

<hr>

<a

href="#"

id="logout-btn"

class="logout-link"

>

<img

src="/assets/icons/log-out.svg"

alt=""

>

<span>

Keluar

</span>

</a>

</div>

</div>

`;

    /* ======================================================
       MOBILE DRAWER
    ====================================================== */

    if (mobileMenu) {

        mobileMenu.innerHTML = `

<div class="mobile-user-card">

<img

src="${avatar}"

class="user-avatar"

alt="${safeNama}"

onerror="this.src='/assets/images/default-avatar.png'"

>

<div class="mobile-user-info">

<strong>

${safeNama}

</strong>

<span>

${role}

</span>

</div>

</div>

<div class="mobile-menu-group">

<a href="/profile/">

<img

src="/assets/icons/user.svg"

class="menu-icon"

alt=""

>

<span>

Profil

</span>

</a>

<a href="/bookmark/">

<img

src="/assets/icons/bookmark.svg"

class="menu-icon"

alt=""

>

<span>

Bookmark

</span>

</a>

<a href="/profile/settings.html">

<img

src="/assets/icons/settings.svg"

class="menu-icon"

alt=""

>

<span>

Pengaturan

</span>

</a>

<a href="/profile/preferences.html">

<img

src="/assets/icons/sliders-horizontal.svg"

class="menu-icon"

alt=""

>

<span>

Preferensi

</span>

</a>

<hr>

<a

href="#"

id="mobile-logout-btn"

class="logout-link"

>

<img

src="/assets/icons/log-out.svg"

class="menu-icon"

alt=""

>

<span>

Keluar

</span>

</a>

</div>

`;

    }

    /* ======================================================
       LOGOUT
    ====================================================== */

    if (

        typeof window.initLogout ===
        "function"

    ) {

        window.initLogout();

    }

    /* logout mobile */

    const mobileLogout =
        document.getElementById(
            "mobile-logout-btn"
        );

    if (

        mobileLogout &&

        typeof logout ===
        "function"

    ) {

        mobileLogout.addEventListener(

            "click",

            function (event) {

                event.preventDefault();

                logout();

            }

        );

    }

    initAccountDropdown();

}

/* ==========================================================
   ACCOUNT DROPDOWN
========================================================== */

function initAccountDropdown() {

    const dropdown =
        document.querySelector(
            ".auth-dropdown"
        );

    const button =
        document.getElementById(
            "account-button"
        );

    if (

        !dropdown ||

        !button

    ) {

        return;

    }

    button.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();

            dropdown.classList.toggle(
                "open"
            );

        }

    );

    dropdown.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();

        }

    );

    document.addEventListener(

        "click",

        function () {

            dropdown.classList.remove(
                "open"
            );

        }

    );

}