// ====================================
// HOMEPAGE CONFIGURATION
// ====================================

const configData = {

    // Jumlah item yang ditampilkan
    // pada setiap section homepage
    LIMIT: 3,

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

// Expose ke global agar dapat digunakan
// oleh api.js dan modul homepage lainnya
window.HOME_CONFIG = configData;
window.APP_CONFIG = configData;