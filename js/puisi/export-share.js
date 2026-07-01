// js/puisi/export-share.js

// Langkah 1: Mengambil teks dari card analisis
function getAnalysisText() {
    const card = document.querySelector(".analysis-card");
    if (!card) {
        return "";
    }
    return card.innerText;
}

window.getAnalysisText = getAnalysisText;

// Langkah 2: Tombol Salin Hasil ke Clipboard
async function copyAnalysis() {
    const text = getAnalysisText();
    if (!text) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        alert("Hasil analisis berhasil disalin.");
    } catch {
        alert("Gagal menyalin.");
    }
}

window.copyAnalysis = copyAnalysis;

// Langkah 3: Mengunduh Hasil Sebagai File .txt
function downloadAnalysis() {
    const text = getAnalysisText();
    if (!text) {
        return;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "analisis-puisi.txt";
    link.click();

    URL.revokeObjectURL(url);
}

window.downloadAnalysis = downloadAnalysis;

// Langkah 4: Berbagi Menggunakan Web Share API atau Fallback ke Salin
async function shareAnalysis() {
    const text = getAnalysisText();
    if (!text) {
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Analisis Puisi",
                text: text,
                url: location.href
            });
        } catch {
            // Mengabaikan error jika pengguna membatalkan share
        }
        return;
    }

    // Fallback jika browser tidak mendukung navigator.share
    try {
        await navigator.clipboard.writeText(text);
        alert("Browser tidak mendukung Share. Hasil telah disalin.");
    } catch {
        alert("Gagal menyalin otomatis.");
    }
}

window.shareAnalysis = shareAnalysis;