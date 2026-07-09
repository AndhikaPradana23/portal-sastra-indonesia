document.addEventListener(
    "DOMContentLoaded",
    initProfilePage
);

/**
 * Controller Utama Halaman Profil
 * Mengatur alur pemuatan komponen, proteksi rute, dan rendering data.
 */
async function initProfilePage(){

    // 1. Memuat layout utama (Header & Footer)
    await loadLayout();

    // 2. Merender navigasi Breadcrumb
    if (typeof renderBreadcrumb === "function") {
        renderBreadcrumb([
            {
                label: "Beranda",
                href: "/index.html"
            },
            {
                label: "Profil Saya"
            }
        ]);
    }

    // 3. Memeriksa apakah pengguna sudah login via protected-route.js
    const allowed =
        await requireAuth();

    if(!allowed){
        // Menghentikan eksekusi jika tidak lolos (otomatis di-redirect ke /auth/login.html)
        return;
    }

    // 4. Jika lolos proteksi, muat data profil pengguna
    await loadProfile();

}

/**
 * Helper untuk mengamankan nilai dari XSS dan memberikan fallback jika kosong
 */
function safeValue(value) {
    if (!value) {
        return "-";
    }
    return typeof window.escapeHtml === "function"
        ? window.escapeHtml(value)
        : value;
}

/**
 * Formatter tanggal untuk mengubah format ISO menjadi format tanggal Indonesia
 */
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

/**
 * Formatter waktu aktivitas terakhir pengguna.
 */
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

/**
 * Memuat dan menampilkan data profil pengguna ke dalam interface (DOM)
 */
async function loadProfile(){

    const container =
        document.getElementById(
            "profile-container"
        );

    if (!container) {
        console.error("Elemen #profile-container tidak ditemukan di HTML.");
        return;
    }

    // Mengambil data profil (memanggil fungsi dari service)
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

    // Menggunakan helper safeValue untuk proteksi XSS defensif
    const safeNama = safeValue(profile.nama_lengkap);
    const safeEmail = safeValue(profile.email);
    const safeUsername = safeValue(profile.username);
    const safeJenisKelamin = safeValue(profile.jenis_kelamin);
    const safeNoTelp = safeValue(profile.no_telp);

    // Menggunakan status bio informatif
    const safeBio = profile.bio
        ? safeValue(profile.bio)
        : "<span class='text-muted'>Belum menambahkan bio.</span>";

    // Format tanggal menggunakan helper baru
    const tanggalBergabung = formatTanggalIndonesia(profile.created_at);
    const tanggalLahirFormatted = formatTanggalIndonesia(profile.tanggal_lahir);

    // Kondisi untuk render avatar gambar atau emoji default
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
        <div class="profile-card">

            <div class="profile-header-block">
                <div class="profile-avatar">
                    ${avatarHtml}
                </div>
                <h2>${safeNama}</h2> 
                <p class="profile-username-sub">@${safeUsername}</p>
                <p class="profile-bio-text"><em>"${safeBio}"</em></p>
            </div>

            <!-- BAGIAN 1: BIODATA -->
            <div class="profile-section">
                <h3>Biodata</h3>
                <div class="profile-meta-grid">
                    <div class="meta-item">
                        <span>Nama Lengkap</span>
                        <strong>${safeNama}</strong>
                    </div>
                    <div class="meta-item">
                        <span>Username</span>
                        <strong>${safeUsername}</strong>
                    </div>
                    <div class="meta-item">
                        <span>Jenis Kelamin</span>
                        <strong>${safeJenisKelamin}</strong>
                    </div>
                    <div class="meta-item">
                        <span>Tanggal Lahir</span>
                        <strong>${tanggalLahirFormatted}</strong>
                    </div>
                    <div class="meta-item">
                        <span>No. Telepon</span>
                        <strong>${safeNoTelp}</strong>
                    </div>
                </div>
            </div>

            <!-- BAGIAN 2: INFORMASI AKUN -->
            <div class="profile-section">
                <h3>Informasi Akun</h3>
                <div class="profile-meta-grid">
                    <div class="meta-item">
                        <span>Email</span>
                        <strong>${safeEmail}</strong>
                    </div>
                    <div class="meta-item">
                        <span>Role</span>
                        ${renderRoleBadge(profile.role)}
                    </div>
                    <div class="meta-item">
                        <span>Tanggal Bergabung</span>
                        <strong>${tanggalBergabung}</strong>
                    </div>
                    <div class="meta-item">
                        <span>Terakhir Aktif</span>
                        <strong>
                            ${formatLastSeen(profile.last_seen_at)}
                        </strong>
                    </div>
                    <div class="meta-item">
                        <span>ID Pengguna</span>
                        <strong class="uid-text">${profile.id}</strong>
                    </div>
                </div>
            </div>

        </div>

        <!-- Tombol Aksi Akses Cepat Pengguna -->
        <div class="profile-actions">
            <a
                href="/profile/settings.html"
                class="btn btn-primary"
            >
                Edit Profil
            </a>
            <a
                href="/profile/preferences.html"
                class="btn btn-outline"
            >
                Preferensi
            </a>
        </div>
    `;

}