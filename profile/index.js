document.addEventListener(
    "DOMContentLoaded",
    initProfilePage
);

async function initProfilePage(){

    await loadLayout();

    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/",
                icon: "/assets/icons/house.svg"
            },
            {
                label: "Profil Saya",
                icon: "/assets/icons/user-round.svg"
            }
        ]);
    }

    const allowed =
        await requireAuth();

    if(!allowed){
        return;
    }

    await loadProfile();

}

function safeValue(value) {
    if (!value) {
        return "-";
    }
    return typeof window.escapeHtml === "function"
        ? window.escapeHtml(value)
        : value;
}

function formatTanggalIndonesia(value){
    if(!value){
        return "-";
    }
    try{
        return new Date(value)
            .toLocaleDateString(
                "id-ID",
                {
                    day:"numeric",
                    month:"long",
                    year:"numeric"
                }
            );
    }
    catch{
        return value;
    }
}

function formatLastSeen(value){

    if(!value){

        return "Belum pernah";

    }

    const now =
        new Date();

    const last =
        new Date(value);

    const diff =
        Math.floor(

            (now-last)/1000

        );

    if(diff<60){

        return "Baru saja";

    }

    if(diff<3600){

        return `${Math.floor(diff/60)} menit yang lalu`;

    }

    if(diff<86400){

        return `${Math.floor(diff/3600)} jam yang lalu`;

    }

    if(diff<172800){

        return "Kemarin";

    }

    return last.toLocaleDateString(

        "id-ID",

        {

            day:"numeric",

            month:"long",

            year:"numeric"

        }

    );

}

function renderItem(icon, label, value){

    return `
        <div class="profile-item">

            <div class="profile-item-icon">

                <img src="${icon}" alt="">

            </div>

            <div>

                <span>${label}</span>

                <strong>${value}</strong>

            </div>

        </div>
    `;

}

async function loadProfile(){

    const container =
        document.getElementById(
            "profile-container"
        );

    if (!container) {
        console.error("Elemen #profile-container tidak ditemukan di HTML.");
        return;
    }

    const profile =
        await getProfile();

    if(!profile){

        container.innerHTML = `
            <p class="error-message">
                Profil tidak ditemukan atau gagal memuat data.
            </p>
        `;

        return;

    }

    const safeNama = safeValue(profile.nama_lengkap);
    const safeEmail = safeValue(profile.email);
    const safeUsername = safeValue(profile.username);
    const safeJenisKelamin = safeValue(profile.jenis_kelamin);
    const safeNoTelp = safeValue(profile.no_telp);

    const safeBio = profile.bio
        ? safeValue(profile.bio)
        : "<span class='text-muted'>Belum menambahkan bio.</span>";

    const tanggalBergabung = formatTanggalIndonesia(profile.created_at);
    const tanggalLahirFormatted = formatTanggalIndonesia(profile.tanggal_lahir);

    const avatarHtml = profile.avatar_url
        ? `
        <img
            src="${profile.avatar_url}"
            alt="${safeNama}"
            class="profile-avatar-image"
        >
        `
        : `👤`;

    // Menyuntikkan template UI Profil ke dalam kontainer HTML
    container.innerHTML = `

<div class="profile-card fade-up">

    <div class="profile-cover"></div>

    <div class="profile-header">

        <div class="profile-avatar">

            ${avatarHtml}

        </div>

        <div class="profile-title">

            <h2>${safeNama}</h2>

            <p>@${safeUsername}</p>

            <div class="profile-role">

                ${renderRoleBadge(profile.role)}

            </div>

        </div>

    </div>

    <div class="profile-bio">

        ${safeBio}

    </div>

    <div class="profile-grid">

        <div class="profile-info-card">

            <h3>

                <img src="/assets/icons/badge-info.svg" class="info-icon">

                Biodata

            </h3>

            ${renderItem(
                "/assets/icons/user.svg",
                "Nama Lengkap",
                safeNama
            )}

            ${renderItem(
                "/assets/icons/at-sign.svg",
                "Username",
                safeUsername
            )}

            ${renderItem(
                "/assets/icons/users.svg",
                "Jenis Kelamin",
                safeJenisKelamin
            )}

            ${renderItem(
                "/assets/icons/calendar.svg",
                "Tanggal Lahir",
                tanggalLahirFormatted
            )}

            ${renderItem(
                "/assets/icons/phone.svg",
                "No. Telepon",
                safeNoTelp
            )}

        </div>

        <div class="profile-info-card">

            <h3>

                <img src="/assets/icons/shield-user.svg" class="info-icon">

                Informasi Akun

            </h3>

            ${renderItem(
                "/assets/icons/mail.svg",
                "Email",
                safeEmail
            )}

            ${renderItem(
                "/assets/icons/calendar-plus.svg",
                "Bergabung",
                tanggalBergabung
            )}

            ${renderItem(
                "/assets/icons/activity.svg",
                "Terakhir Aktif",
                formatLastSeen(profile.last_seen_at)
            )}

            ${renderItem(
                "/assets/icons/fingerprint-pattern.svg",
                "ID Pengguna",
                profile.id
            )}

        </div>

    </div>

    <div class="profile-actions">

        <a
            href="/profile/settings.html"
            class="btn btn-primary"
        >

            <img
                src="/assets/icons/pencil.svg"
                class="btn-icon"
                alt=""
            >

            Edit Profil

        </a>

        <a
            href="/profile/preferences.html"
            class="btn btn-outline"
        >

            <img
                src="/assets/icons/sliders-horizontal.svg"
                class="btn-icon"
                alt=""
            >

            Preferensi

        </a>

    </div>

</div>

`;

}