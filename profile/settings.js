document.addEventListener("DOMContentLoaded", initPage);

// ==========================================
// Avatar Configuration
// ==========================================
const MAX_AVATAR_SIZE =
    2 * 1024 * 1024; // 2 MB

const ALLOWED_AVATAR_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];

/**
 * Inisialisasi halaman pengaturan saat DOM selesai dimuat.
 */
async function initPage() {
    await requireAuth();
    await loadLayout();
    
    // Panggil fungsi global renderBreadcrumb untuk halaman pengaturan profil
    renderBreadcrumb([
        {
            label: "Beranda",
            href: "/",
            icon: "/assets/icons/house.svg"
        },
        {
            label: "Profil Saya",
            href: "/profile/",
            icon: "/assets/icons/user-round.svg"
        },
        {
            label: "Pengaturan"
        }
    ]);

    await loadProfile();
    initForms();
}

/**
 * Memuat data profil user yang sedang aktif ke dalam form.
 */
async function loadProfile(){

    const profile =
        await getProfile();

    if(!profile){
        return;
    }

    // ===========================
    // Avatar
    // ===========================

    const avatarPreview =
        document.getElementById(
            "avatar-preview"
        );

    if(avatarPreview){

        avatarPreview.src =
            profile.avatar_url ||
            "/icon/default-avatar.png";

    }

    // ===========================
    // Header Card
    // ===========================

    const avatarNama =
        document.getElementById(
            "avatar-nama"
        );

    if(avatarNama){

        avatarNama.textContent =
            profile.nama_lengkap;

    }

    const avatarRole =
        document.getElementById(
            "avatar-role"
        );

    if(
        avatarRole &&
        typeof renderRoleBadge === "function"
    ){

        avatarRole.innerHTML =
            renderRoleBadge(
                profile.role
            );

    }

    // ===========================
    // Form
    // ===========================

    document.getElementById(
        "nama_lengkap"
    ).value =
        profile.nama_lengkap ?? "";

    document.getElementById(
        "username"
    ).value =
        profile.username ?? "";

    document.getElementById(
        "email"
    ).value =
        profile.email ?? "";

    document.getElementById(
        "no_telp"
    ).value =
        profile.no_telp ?? "";

    document.getElementById(
        "tanggal_lahir"
    ).value =
        profile.tanggal_lahir ?? "";

    document.getElementById(
        "jenis_kelamin"
    ).value =
        profile.jenis_kelamin ?? "";

    document.getElementById(
        "bio"
    ).value =
        profile.bio ?? "";

}

/**
 * Memasang event listener untuk form profil, form ganti password, dan aksi danger zone.
 */
function initForms(){

    document

        .getElementById(
            "profile-form"
        )

        .addEventListener(
            "submit",
            handleProfileUpdate
        );

    document

        .getElementById(
            "password-form"
        )

        .addEventListener(
            "submit",
            updatePassword
        );

    document

        .getElementById(
            "avatar"
        )

        ?.addEventListener(
            "change",
            handleAvatarUpload
        );

    document

        .getElementById(
            "delete-account"
        )

        ?.addEventListener(

            "click",

            ()=>{

                alert(
                    "Fitur hapus akun akan ditambahkan pada versi berikutnya."
                );

            }

        );

}

/**
 * Mengubah data profil di tabel profiles.
 */
async function handleProfileUpdate(event) {
    event.preventDefault();

    const submitButton =
        event.submitter;

    submitButton.disabled = true;

    submitButton.textContent =
        "Menyimpan...";

    const namaLengkap =
        document
        .getElementById(
            "nama_lengkap"
        )
        .value
        .trim();

    const username =
        document
        .getElementById(
            "username"
        )
        .value
        .trim();

    const noTelp =
        document
        .getElementById(
            "no_telp"
        )
        .value
        .trim();

    const tanggalLahir =
        document
        .getElementById(
            "tanggal_lahir"
        )
        .value;

    const jenisKelamin =
        document
        .getElementById(
            "jenis_kelamin"
        )
        .value;

    const bio =
        document
        .getElementById(
            "bio"
        )
        .value
        .trim();

    // ==========================
    // VALIDASI INPUT PROFIL
    // ==========================
    const usernameRegex =
        /^[a-z0-9._]+$/;

    if (!usernameRegex.test(username)) {
        alert(
            "Username hanya boleh berisi huruf kecil, angka, titik (.) and underscore (_)."
        );
        submitButton.disabled = false;
        submitButton.textContent = "Simpan Perubahan";
        return;
    }

    if (namaLengkap.length < 3) {
        alert(
            "Nama lengkap minimal 3 karakter."
        );
        submitButton.disabled = false;
        submitButton.textContent = "Simpan Perubahan";
        return;
    }

    if (bio.length > 500) {
        alert(
            "Bio maksimal 500 karakter."
        );
        submitButton.disabled = false;
        submitButton.textContent = "Simpan Perubahan";
        return;
    }

    if (tanggalLahir) {
        const today =
            new Date();
        const birth =
            new Date(tanggalLahir);

        if (birth > today) {
            alert(
                "Tanggal lahir tidak valid."
            );
            submitButton.disabled = false;
            submitButton.textContent = "Simpan Perubahan";
            return;
        }
    }

    try {
        await window.updateProfile({
            namaLengkap,
            username,
            noTelp,
            tanggalLahir,
            jenisKelamin,
            bio
        });

        await getProfile(true);

        await loadProfile();

        alert("Profil berhasil diperbarui.");

        if (
            typeof window.initAuthUI ===
            "function"
        ) {
            await window.initAuthUI();
        }
    } 
    catch (error) {
        if (typeof window.clearProfileCache === "function") {
            window.clearProfileCache();
        }
        console.error(error);
        alert(error.message);
    }
    finally {
        submitButton.disabled = false;
        submitButton.textContent =
            "Simpan Perubahan";
    }
}

/**
 * Mengubah password akun user saat ini di Supabase Auth.
 */
async function updatePassword(event) {
    event.preventDefault();

    const submitButton =
        event.submitter;

    submitButton.disabled = true;

    submitButton.textContent =
        "Mengubah...";

    const password =
        document
            .getElementById(
                "password"
            )
            .value
            .trim();

    const confirmPassword =
        document
            .getElementById(
                "confirm_password"
            )
            .value
            .trim();

    // ==========================
    // VALIDASI PASSWORD
    // ==========================
    if(password!==confirmPassword){
        alert(
            "Konfirmasi password tidak sama."
        );
        submitButton.disabled=false;
        submitButton.textContent=
            "Ubah Password";
        return;
    }

    if (password.length < 8) {
        alert(
            "Password minimal 8 karakter."
        );
        submitButton.disabled = false;
        submitButton.textContent = "Ubah Password";
        return;
    }

    try {
        const { error } = await supabaseClient.auth.updateUser({
            password: password
        });

        if (error) {
            throw error;
        }

        resetPasswordForm();
        alert("Password berhasil diubah.");
    } 
    catch (error) {
        console.error(error);
        alert(error.message);
    }
    finally {
        submitButton.disabled = false;
        submitButton.textContent =
            "Ubah Password";
    }
}

/**
 * Memproses unggahan foto profil baru ke Storage dan memperbarui URL di database.
 */
async function handleAvatarUpload(event){

    const file =
        event.target.files[0];

    const preview =
        document.getElementById(
            "avatar-preview"
        );
    if(preview){
        preview.src =
            URL.createObjectURL(file);
    }

    if(!file){
        return;
    }

    // =====================================
    // Validasi ukuran file
    // =====================================
    if(file.size <= 0){
        alert(
            "File tidak valid."
        );
        event.target.value = "";
        return;
    }

    if(file.size > MAX_AVATAR_SIZE){
        alert(
            "Ukuran foto maksimal 2 MB."
        );
        event.target.value = "";
        return;
    }

    // =====================================
    // Validasi tipe file
    // =====================================
    if(
        !ALLOWED_AVATAR_TYPES.includes(
            file.type
        )
    ){
        alert(
            "Format gambar harus JPG, PNG, atau WEBP."
        );
        event.target.value = "";
        return;
    }

    try{
        const avatarUrl =
            await uploadAvatar(
                file
            );

        await updateAvatar(
            avatarUrl
        );

        await getProfile(
            true
        );

        await loadProfile();

        if(
            typeof window.initAuthUI===
            "function"
        ){
            await window.initAuthUI();
        }

        alert(
            "Foto profil berhasil diperbarui."
        );
    }
    catch(error){
        console.error(error);
        alert(
            error.message
        );
    }
    finally{
        event.target.value = "";
    }
}

/**
 * Helper untuk mengosongkan input pada form password.
 */
function resetPasswordForm(){
    document
        .getElementById(
            "password"
        )
        .value="";

    document
        .getElementById(
            "confirm_password"
        )
        .value="";
}