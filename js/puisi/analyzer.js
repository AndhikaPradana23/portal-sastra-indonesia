// ==========================================
// FUNGSI PEMBANTU & LOGIKA KATA (DI-UPDATE)
// ==========================================

// Bonus 1: Menambahkan daftar kata tidak penting (Stop Words)
const stopWords = [
    "dan",
    "yang",
    "di",
    "ke",
    "dari",
    "untuk",
    "atau",
    "pada",
    "dengan",
    "karena"
];

// Asumsi fungsi hitungFrekuensiKata bawaan di-update filternya
function hitungFrekuensiKata(text) {
    if (!text) return [];
    
    // Pembersihan teks standar (lowercase dan hapus tanda baca)
    const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, " ");
    const words = cleanText.split(/\s+/);
    
    // Filter kata kosong DAN saring stopWords
    const filteredWords = words.filter(
        word =>
            word !== "" &&
            !stopWords.includes(word)
    );
    
    // Hitung kemunculan
    const countMap = {};
    filteredWords.forEach(word => {
        countMap[word] = (countMap[word] || 0) + 1;
    });
    
    // Kembalikan dalam bentuk Array [kata, total] urut menurun
    return Object.entries(countMap).sort((a, b) => b[1] - a[1]);
}

// Asumsi fungsi renderWordCloud bawaan di-update visualisasinya
function renderWordCloud(frekuensi) {
    if (!frekuensi || frekuensi.length === 0) return "-";
    
    // Ambil maksimal 20 kata teratas untuk visualisasi awan kata yang ideal
    const cloudWords = frekuensi.slice(0, 20);
    const maxCount = cloudWords[0][1];
    
    // Bonus 2: Daftar warna acak modern
    const colors = [
        "#2563eb",
        "#059669",
        "#dc2626",
        "#9333ea",
        "#f59e0b",
        "#0891b2"
    ];

    return cloudWords.map(([kata, total]) => {
        // Logika penentuan ukuran font dinamis (berkisar antara 14px s.d 36px)
        const size = Math.max(14, Math.min(36, (total / maxCount) * 32));
        
        // Pilih warna acak dari palet
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Bonus 3 & 4: Link pencarian global dengan atribut class, style, dan title hover info
        return `
            <a
                href="/search/index.html?q=${encodeURIComponent(kata)}"
                class="word-item"
                style="font-size:${size}px; color:${color}; display: inline-block; margin: 5px; text-decoration: none;"
                title="Muncul ${total} kali &#10;Cari: ${kata}"
            >
                ${kata}
            </a>
        `;
    }).join(" ");
}


// ==========================================
// LOGIKA AKSI (DOWNLOAD, COPY, SHARE)
// ==========================================

// Fungsi pembuat format teks analisis untuk disalin/didownload/dibagikan
function getAnalysisText() {
    // Fungsi ini mengambil data teks dari DOM hasil analisis atau variabel global Anda
    const resultCard = document.querySelector(".analysis-card");
    return resultCard ? resultCard.innerText : "Hasil Analisis Puisi";
}

function copyAnalysis() {
    const text = getAnalysisText();
    navigator.clipboard.writeText(text)
        .then(() => alert("Hasil analisis berhasil disalin ke clipboard!"))
        .catch(err => console.error("Gagal menyalin teks: ", err));
}

// BONUS 1: Implementasi Nama File Dinamis Berdasarkan Tanggal Saat Ini
function downloadAnalysis() {
    const text = getAnalysisText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    // Penamaan file dinamis: analisis-puisi-YYYY-MM-DD.txt
    const tanggal = new Date().toISOString().split("T")[0];
    link.download = `analisis-puisi-${tanggal}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareAnalysis() {
    // Fungsi fallback share bawaan jika diperlukan
    if (navigator.share) {
        navigator.share({
            title: 'Hasil Analisis Puisi',
            text: getAnalysisText()
        }).catch(console.error);
    } else {
        alert("Fitur Web Share tidak didukung di browser ini. Gunakan tombol WhatsApp.");
    }
}

// BONUS 2: Implementasi Fungsi Berbagi ke WhatsApp
function shareWhatsapp() {
    const text = encodeURIComponent(getAnalysisText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
}

// Daftarkan fungsi ke scope global window agar bisa diakses dari file HTML lain jika diperlukan
window.shareWhatsapp = shareWhatsapp;


// ==========================================
// FUNGSI UTAMA ANALISIS
// ==========================================

function analyzePuisi(){

    const text =
        document
            .getElementById(
                "puisi-input"
            )
            .value;

    if(!text.trim()){
        return;
    }

    // --- Pemanggilan Fungsi Metrik Komponen (Asumsi Sudah Didefinisikan di File Lain) ---
    const jumlahBait = typeof hitungBait === "function" ? hitungBait(text) : 0;
    const jumlahLarik = typeof hitungLarik === "function" ? hitungLarik(text) : 0;
    const jumlahKata = typeof hitungKata === "function" ? hitungKata(text) : 0;
    const huruf = typeof hitungHuruf === "function" ? hitungHuruf(text) : {};
    const dominanHuruf = typeof getDominanHuruf === "function" ? getDominanHuruf(huruf) : null;
    const vokal = typeof hitungVokal === "function" ? hitungVokal(text) : {};
    const dominanVokal = typeof getDominanVokal === "function" ? getDominanVokal(vokal) : null;
    
    const hasilRima = typeof buatPolaRima === "function" ? buatPolaRima(text) : { pola: "-" };
    
    // Langkah 6: Integrasi deteksi dan render majas setelah hasilRima
    const hasilMajas = typeof detectMajas === "function" ? detectMajas(text) : [];
    const majasHtml = typeof renderMajas === "function" ? renderMajas(hasilMajas) : "-";

    const jenisRima = typeof getJenisRima === "function" ? getJenisRima(hasilRima.pola) : "-";
    const larik = typeof ambilLarik === "function" ? ambilLarik(text) : [];

    const frekuensi = hitungFrekuensiKata(text);
    const wordCloud = renderWordCloud(frekuensi);

    const totalVokal =
        Object
            .values(vokal)
            .reduce(
                (a, b) => a + b,
                0
            );

    const detailRima =
        larik
            .map(
                item => {
                    const bunyi = typeof ambilBunyiAkhir === "function" ? ambilBunyiAkhir(item) : "-";
                    return `
                        <li>
                            ${item}
                            <br>
                            <small>
                                ➜ ${bunyi}
                            </small>
                        </li>
                    `;
                }
            )
            .join("");

    const rataKata =
        jumlahLarik > 0
            ? (jumlahKata / jumlahLarik).toFixed(1)
            : 0;

    const frekuensiHtml =
        frekuensi
            .slice(0, 10)
            .map(
                ([kata, total]) => {
                    const persen =
                        jumlahKata > 0
                            ? (total / jumlahKata * 100).toFixed(1)
                            : 0;

                    return `
                        <li class="frequency-item">
                            <span>
                                ${kata}
                            </span>
                            <strong>
                                ${total}
                            </strong>
                            <small>
                                ${persen}%
                            </small>
                        </li>
                    `;
                }
            )
            .join("");

    const topWordsHtml =
        frekuensi
            .slice(0, 5)
            .map(([kata]) => `
                <span class="top-word-badge">
                    ${kata}
                </span>
            `)
            .join("");

    // Memasukkan HTML hasil analisis beserta tombol aksi baru ke DOM
    document
        .getElementById(
            "analysis-result"
        )
        .innerHTML = `
            <div class="analysis-card">

                <div class="analysis-header">
                    <div class="analysis-title">
                        <img
                            src="/assets/icons/chart-column.svg"
                            class="analysis-title-icon"
                            alt="">
                        <h3>
                            Hasil Analisis
                        </h3>
                    </div>
                </div>

                <div class="analysis-stat-card">
                    <strong>
                        Jumlah Bait
                    </strong>
                    <span>
                        ${jumlahBait}
                    </span>
                </div>

                <div class="analysis-stat-card">
                    <strong>
                        Jumlah Larik
                    </strong>
                    <span>
                        ${jumlahLarik}
                    </span>
                </div>

                <div class="analysis-stat-card">
                    <strong>
                        Jumlah Kata
                    </strong>
                    <span>
                        ${jumlahKata}
                    </span>
                </div>

                <div class="analysis-stat-card">
                    <strong>
                        Rata-rata Kata/Larik
                    </strong>
                    <span>
                        ${rataKata}
                    </span>
                </div>

                <div class="analysis-section">
                    <h4>
                        Huruf Dominan
                    </h4>
                    <p>
                        ${
                            dominanHuruf
                                ? `${dominanHuruf[0]} (${dominanHuruf[1]} kali)`
                                : "-"
                        }
                    </p>
                </div>

                <div class="analysis-section">
                    <h4>
                        Vokal Dominan
                    </h4>
                    <p>
                        ${
                            dominanVokal
                                ? `${dominanVokal[0]} (${dominanVokal[1]} kali)`
                                : "-"
                        }
                    </p>
                </div>

                <div class="analysis-section">
                    <h4>
                        Statistik Vokal
                    </h4>
                    <ul>
                        ${
                            Object
                                .entries(vokal)
                                .map(
                                    ([huruf, total]) => {
                                        const persen =
                                            totalVokal
                                                ? (total / totalVokal * 100).toFixed(1)
                                                : 0;
                                        return `
                                            <li>
                                                ${huruf} : ${total} (${persen}%)
                                            </li>
                                        `;
                                    }
                                )
                                .join("")
                        }
                    </ul>
                </div>

                <div class="analysis-section">
                    <h4>
                        Analisis Rima
                    </h4>
                    <div class="rima-box">
                        <p>
                            <strong>Pola: </strong> ${hasilRima.pola}
                        </p>
                        <p>
                            <strong>Jenis: </strong> ${jenisRima}
                        </p>
                    </div>
                </div>

                <!-- Langkah 7: Menampilkan Hasil Analisis Majas -->
                <div class="analysis-section">
                    <h4>
                        Analisis Majas
                    </h4>
                    ${majasHtml}
                </div>

                <div class="analysis-section">
                    <h4>
                        Bunyi Akhir Larik
                    </h4>
                    <ul class="rima-list">
                        ${detailRima}
                    </ul>
                </div>

                <div class="analysis-section">
                    <h4>
                        Kata Dominan
                    </h4>
                    <div class="top-words">
                        ${topWordsHtml}
                    </div>
                </div>

                <div class="analysis-section">
                    <h4>
                        Word Cloud
                    </h4>
                    <div class="word-cloud">
                        ${wordCloud}
                    </div>
                </div>

                <div class="analysis-section">
                    <h4>
                        Frekuensi Kata
                    </h4>
                    <ol class="word-frequency">
                        ${frekuensiHtml}
                    </ol>
                </div>

            </div>

            <div class="analysis-actions">
                <button
                    id="copy-analysis"
                    class="btn btn-outline">
                    <img
                        src="/assets/icons/copy.svg"
                        class="btn-icon"
                        alt="">
                    <span>Salin Hasil</span>
                </button>

                <button
                    id="download-analysis"
                    class="btn btn-outline">
                    <img
                        src="/assets/icons/download.svg"
                        class="btn-icon"
                        alt="">
                    <span>Download TXT</span>
                </button>

                <button
                    id="wa-analysis"
                    class="btn btn-outline">
                    <img
                        src="/assets/icons/message-circle.svg"
                        class="btn-icon"
                        alt="">
                    <span>WhatsApp</span>
                </button>

                <button
                    id="share-analysis"
                    class="btn btn-outline">
                    <img
                        src="/assets/icons/share-2.svg"
                        class="btn-icon"
                        alt="">
                    <span>Bagikan</span>
                </button>
            </div>
        `;

    // Pasang Event Listener tepat setelah .innerHTML diterapkan ke DOM
    document
        .getElementById(
            "copy-analysis"
        )
        .onclick = copyAnalysis;

    document
        .getElementById(
            "download-analysis"
        )
        .onclick = downloadAnalysis;

    // Menghubungkan tombol WhatsApp dengan fungsi shareWhatsapp
    document
        .getElementById(
            "wa-analysis"
        )
        .onclick = shareWhatsapp;

    document
        .getElementById(
            "share-analysis"
        )
        .onclick = shareAnalysis;
}

window.analyzePuisi = analyzePuisi;