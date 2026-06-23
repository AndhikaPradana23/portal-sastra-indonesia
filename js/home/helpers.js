// =================================================================
// HELPERS CONFIGURATION & UTILITIES
// =================================================================

const HOME_HELPERS = {
    
    /**
     * Memotong teks jika melebihi panjang maksimum dan menambahkan ellipsis (...)
     * @param {string} text - Teks asli yang akan dipotong
     * @param {number} panjang - Batas maksimal karakter (default: 120)
     * @returns {string}
     */
    potongTeks(text, panjang = 120) {
        if (!text) {
            return "";
        }

        if (text.length <= panjang) {
            return text;
        }

        return text.substring(0, panjang) + "...";
    },

    /**
     * Mengamankan string dari karakter HTML berbahaya (mencegah XSS)
     * @param {string} text - String mentah
     * @returns {string}
     */
    escapeHtml(text) {
        if (!text) {
            return "";
        }

        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    /**
     * Memformat angka ke dalam format lokalisasi Indonesia (e.g., 1.000.000)
     * @param {number} number - Angka yang akan diformat
     * @returns {string}
     */
    formatNumber(number) {
        return new Intl.NumberFormat(
            "id-ID"
        ).format(number || 0);
    }

};

// =================================================================
// BACKWARD COMPATIBILITY (Gunakan Window Object)
// Menimpa/menyediakan fallback global tanpa memicu SyntaxError redeclare
// =================================================================
if (typeof window.potongTeks === "undefined") {
    window.potongTeks = HOME_HELPERS.potongTeks;
}
if (typeof window.escapeHtml === "undefined") {
    window.escapeHtml = HOME_HELPERS.escapeHtml;
}
if (typeof window.formatNumber === "undefined") {
    window.formatNumber = HOME_HELPERS.formatNumber;
}

// Mengekspos objek utama ke scope global agar bisa diakses via HOME_HELPERS
window.HOME_HELPERS = HOME_HELPERS;