// profile/settings.js

document.addEventListener("DOMContentLoaded", initPage);

/**
 * Inisialisasi halaman pengaturan saat DOM selesai dimuat.
 */
async function initPage() {
    await requireAuth();
    await loadLayout();
    await loadProfile();
    initForms();
}

/**
 * Memuat data profil user yang sedang aktif ke dalam form.
 */
async function loadProfile() {
    const user = await getCurrentUser();

    if (!user) {
        return;
    }

    // Mengisi input nama dari user_metadata dan input email dari auth data
    document.getElementById("nama").value = user.user_metadata?.nama || "";
    document.getElementById("email").value = user.email || "";
}

/**
 * Memasang event listener untuk form profil, form ganti password, dan aksi danger zone.
 */
function initForms() {
    document.getElementById("profile-form").addEventListener("submit", updateProfile);
    document.getElementById("password-form").addEventListener("submit", updatePassword);

    // TAMBAHAN: Listener untuk aksi Hapus Akun (Danger Zone)
    document.getElementById("delete-account")?.addEventListener("click", () => {
        alert("Fitur hapus akun akan ditambahkan pada versi berikutnya.");
    });
}

/**
 * Mengubah metadata profil (nama lengkap) user di Supabase Auth.
 */
async function updateProfile(event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();

    const { error } = await supabaseClient.auth.updateUser({
        data: { nama }
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Profil berhasil diperbarui.");

    // Memperbarui UI navigasi/header jika nama user berubah tanpa perlu reload
    if (typeof window.initAuthUI === "function") {
        await window.initAuthUI();
    }
}

/**
 * Mengubah password akun user saat ini di Supabase Auth.
 */
async function updatePassword(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.updateUser({
        password: password
    });

    if (error) {
        alert(error.message);
        return;
    }

    // Kosongkan kembali input password demi keamanan setelah berhasil diubah
    document.getElementById("password").value = "";

    alert("Password berhasil diubah.");
}