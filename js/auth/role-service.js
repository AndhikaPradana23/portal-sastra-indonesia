// ==========================================
// ROLE SERVICE
// File: js/auth/role-service.js
// ==========================================

const ROLE_CONFIG = {

    user:{

        label:"User",

        icon:"👤",

        className:"role-user"

    },

    kontributor:{

        label:"Kontributor",

        icon:"✍",

        className:"role-kontributor"

    },

    editor:{

        label:"Editor",

        icon:"📝",

        className:"role-editor"

    },

    admin:{

        label:"Admin",

        icon:"🛡",

        className:"role-admin"

    },

    super_admin:{

        label:"Super Admin",

        icon:"👑",

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
 * Merender badge role.
 */
function renderRoleBadge(role){

    const config =

        getRole(role);

    return `

        <span class="role-badge ${config.className}">

            ${config.icon}

            ${config.label}

        </span>

    `;

}

window.getRole =
    getRole;

window.renderRoleBadge =
    renderRoleBadge;