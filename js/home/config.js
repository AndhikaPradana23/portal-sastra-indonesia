// ====================================
// HOMEPAGE CONFIGURATION
// ====================================

const configData = {
    LIMIT: 6,

    istilah: {
        badge: "Istilah",
        detailUrl: "kamus-istilah/detail.html?slug="
    },

    artikel: {
        badge: "Artikel",
        detailUrl: "artikel/detail.html?slug="
    },

    sastrawan: {
        badge: "Sastrawan",
        detailUrl: "sastrawan/detail.html?slug="
    },

    karya: {
        badge: "Karya Sastra",
        detailUrl: "karya-sastra/detail.html?slug="
    }
};

// Expose ke kedua nama variabel agar api.js maupun modul lain tidak error
window.HOME_CONFIG = configData;
window.APP_CONFIG = configData;