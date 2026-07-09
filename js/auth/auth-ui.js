let authListenerInitialized = false;

window.initAuthUI = initAuthUI;

async function initAuthUI(){

    await updateAuthMenu();

    if(authListenerInitialized){

        return;

    }

    authListenerInitialized = true;

    supabaseClient.auth.onAuthStateChange(

        async () => {

            await updateAuthMenu();

        }

    );

}

async function updateAuthMenu(){

    const menu =
        document.getElementById(
            "auth-menu"
        );

    if(!menu){

        return;

    }

    const user =
        await getCurrentUser();

    if(!user){

        menu.innerHTML = `

            <a
                href="/auth/login.html"
                class="btn btn-primary"
            >

                Masuk

            </a>

        `;

        return;

    }

    const profile =
        await getProfile();

    if(!profile){

        menu.innerHTML = `

            <a
                href="/profile/"
                class="btn btn-outline"
            >

                Profil

            </a>

        `;

        return;

    }

    const roleBadge =
        typeof renderRoleBadge === "function"
        ?
        renderRoleBadge(
            profile.role
        )
        :
        "";

    const safeNama =

        typeof window.escapeHtml === "function"

        ?

        window.escapeHtml(

            profile.nama_lengkap

        )

        :

        profile.nama_lengkap;

    const avatar =

        profile.avatar_url

        ?

        `<img
            src="${profile.avatar_url}"
            alt="${safeNama}"
            class="header-avatar"
        >`

        :

        `👤`;

    menu.innerHTML = `

        <div class="auth-dropdown">

            <button
                type="button"
                class="dropdown-toggle btn btn-outline"
            >

                ${avatar}

                <div class="auth-user-info">
                    <strong>
                        ${safeNama}
                    </strong>
                    ${roleBadge}
                </div>

                ▼

            </button>

            <div class="dropdown-menu">

                <a href="/profile/">

                    Profil Saya

                </a>

                <a href="/profile/settings.html">

                    Pengaturan Akun

                </a>

                <a href="/profile/preferences.html">

                    Preferensi

                </a>

                <hr>

                <a
                    href="#"
                    id="logout-btn"
                >

                    Logout

                </a>

            </div>

        </div>

    `;

    if(

        typeof window.initLogout ===

        "function"

    ){

        window.initLogout();

    }

    // ===============================
    // Dropdown Auth
    // ===============================

    const dropdown =
        menu.querySelector(
            ".auth-dropdown"
        );

    const toggle =
        menu.querySelector(
            ".dropdown-toggle"
        );

    if(toggle && dropdown){

        toggle.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                dropdown.classList.toggle(
                    "open"
                );

            }
        );

        document.addEventListener(
            "click",
            function(){

                dropdown.classList.remove(
                    "open"
                );

            }
        );

    }

}