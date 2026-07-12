// ==========================================
// ROLE SERVICE
// File: js/auth/role-service.js
// ==========================================

const ROLE_CONFIG = {

    user:{

        label:"User",

        icon:"/assets/icons/user-round.svg",

        className:"role-user"

    },

    kontributor:{

        label:"Kontributor",

        icon:"/assets/icons/pen-tool.svg",

        className:"role-kontributor"

    },

    editor:{

        label:"Editor",

        icon:"/assets/icons/file-pen-line.svg",

        className:"role-editor"

    },

    admin:{

        label:"Admin",

        icon:"/assets/icons/shield-check.svg",

        className:"role-admin"

    },

    super_admin:{

        label:"Super Admin",

        icon:"/assets/icons/crown.svg",

        className:"role-super-admin"

    }

};

/**
 * Mengembalikan konfigurasi role.
 */
function getRole(role){

    return ROLE_CONFIG[role] ||

        ROLE_CONFIG.user;

}

/**
 * Merender badge role menggunakan ikon SVG Lucide.
 */
function renderRoleBadge(role){

    const config = getRole(role);

    return `

        <span class="role-badge ${config.className}">

            <img
                src="${config.icon}"
                alt=""
                class="role-badge-icon"
            >

            <span>${config.label}</span>

        </span>

    `;

}

window.getRole =
    getRole;

window.renderRoleBadge =
    renderRoleBadge;