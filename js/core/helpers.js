// =================================================================
// HELPERS CONFIGURATION & UTILITIES
// =================================================================

// =========================
// TEXT
// =========================

/**
 * Mengamankan string dari karakter HTML berbahaya (mencegah XSS)
 * @param {string} text - String mentah
 * @returns {string}
 */
function escapeHtml(text){
    if(text == null){
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Expose langsung ke global scope window
window.escapeHtml = escapeHtml;

/**
 * Memotong teks jika melebihi panjang maksimum dan menambahkan ellipsis (...)
 * @param {string} text - Teks asli yang akan dipotong
 * @param {number} panjang - Batas maksimal karakter (default: 120)
 * @returns {string}
 */
function potongTeks(text, panjang = 120){
    if(!text){
        return "";
    }

    if(text.length <= panjang){
        return text;
    }

    return text.substring(0, panjang) + "...";
}

// Expose langsung ke global scope window
window.potongTeks = potongTeks;

// =========================
// NUMBER
// =========================

/**
 * Memformat angka ke dalam format lokalisasi Indonesia (e.g., 1.000.000)
 * @param {number} number - Angka yang akan diformat
 * @returns {string}
 */
function formatNumber(number){
    return Number(
        number || 0
    ).toLocaleString("id-ID");
}

// Expose langsung ke global scope window
window.formatNumber = formatNumber;

// =========================
// DATE
// =========================

/**
 * Memformat tanggal ke dalam format teks lokalisasi Indonesia (e.g., 17 Agustus 1945)
 * @param {string|Date} tanggal - Tanggal asal
 * @returns {string}
 */
function formatTanggal(tanggal){
    if(!tanggal){
        return "-";
    }

    return new Date(tanggal)
        .toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}

// Expose langsung ke global scope window
window.formatTanggal = formatTanggal;

// =================================================================
// NAMESPACE GLOBAL & BACKWARD COMPATIBILITY
// =================================================================

// Membuat namespace CoreHelpers agar lebih aman dari konflik nama fungsi global
window.CoreHelpers = {
    escapeHtml,
    potongTeks,
    formatNumber,
    formatTanggal
};

// Fallback untuk HOME_HELPERS lama jika masih ada file lain yang memanggilnya
window.HOME_HELPERS = window.CoreHelpers;