// js/auth/preferences.js

/**
 * Mengambil data preferences milik user yang sedang login.
 * @returns {Promise<Object|null>} Data preferences atau null jika terjadi error/tidak ada user.
 */
async function getPreferences() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabaseClient
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching preferences:", error);
        return null;
    }

    return data;
}

/**
 * Menyimpan atau memperbarui data preferences user (Upsert berdasarkan user_id).
 * @param {Object} values - Key-value preferences yang ingin disimpan (e.g., theme, items_per_page).
 * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
 */
async function savePreferences(values) {
    const user = await getCurrentUser();

    if (!user) {
        return false;
    }

    const payload = {
        user_id: user.id,
        ...values,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
        .from("user_preferences")
        .upsert(payload, {
            onConflict: "user_id"
        });

    if (error) {
        console.error("Error saving preferences:", error);
        return false;
    }

    return true;
}

/**
 * Membuat preferences default secara otomatis jika user belum memilikinya.
 */
async function createDefaultPreferences() {
    const user = await getCurrentUser();

    if (!user) {
        return;
    }

    const pref = await getPreferences();

    // Jika sudah ada preferences, jangan timpa dengan data default
    if (pref) {
        return;
    }

    await savePreferences({
        theme: "light",
        items_per_page: 20,
        enable_history: true,
        enable_autocomplete: true
    });
}

/**
 * Menerapkan tema yang dipilih user ke atribut dataset di elemen body.
 */
async function applyPreferences() {
    const pref = await getPreferences();

    if (!pref) {
        return;
    }

    // Mengubah tema aplikasi (misal: <body data-theme="dark">)
    document.body.dataset.theme = pref.theme;
}

// ==========================================
// INISIALISASI HALAMAN PREFERENCES
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        // Memuat layout template (jika ada fungsi loadLayout global)
        if (typeof loadLayout === "function") {
            await loadLayout();
        }

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
    }
);

// Export secara global agar bisa diakses dari file script lain via window
window.PreferencesService = {
    getPreferences,
    savePreferences,
    createDefaultPreferences,
    applyPreferences
};