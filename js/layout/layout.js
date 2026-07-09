async function loadComponent(
    selector,
    file
) {
    const element = document.querySelector(selector);

    if (!element) {
        return;
    }

    try {
        const response = await fetch(file);
        element.innerHTML = await response.text();
    }
    catch (error) {
        console.error(error);
    }
}

async function loadLayout() {
    // Menunggu header dan footer selesai dimasukkan ke DOM secara paralel
    await Promise.all([
        loadComponent(
            "#site-header",
            "/components/header.html"
        ),
        loadComponent(
            "#site-footer",
            "/components/footer.html"
        )
    ]);

    // Jalankan initAuthUI dengan aman menggunakan try-catch
    try {
        if (
            typeof window.initAuthUI ===
            "function"
        ) {
            await window.initAuthUI();
        }

        if(
            typeof window.updateLastSeen ===
            "function"
        ) {
            await window.updateLastSeen();
        }
    }
    catch (error) {
        console.error(
            "Auth UI Error:",
            error
        );
    }

    // HAPUS: await loadBreadcrumb(); (karena merusak halaman indeks)
    
    // UPDATE: Menjalankan initActiveMenu dengan aman agar tidak merusak loadLayout() jika file belum di-load
    if (window.initActiveMenu) {
        window.initActiveMenu();
    }

    // OTOMATIS BERJALAN SETELAH LAYOUT SELESAI DIMUAT
    // Menerapkan preferensi global (seperti tema) jika service tersedia
    if (window.PreferencesService) {
        await window.PreferencesService.applyPreferences();
    }
}

// ==========================================
// FUNGSI GLOBAL BREADCRUMB (LANGKAH 5)
// ==========================================
function renderBreadcrumb(items) {
    const container = document.getElementById("breadcrumb");
    
    // Jika elemen kontainer breadcrumb tidak ada di HTML (misal di halaman indeks), abaikan saja
    if (!container) {
        return;
    }

    let html = `<nav class="breadcrumb"><ol>`;
    
    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast || !item.href) {
            // Item terakhir atau item tanpa link berupa teks biasa (span)
            html += `<li><span>${item.label}</span></li>`;
        } else {
            // Item dengan link
            html += `<li><a href="${item.href}">${item.label}</a></li>`;
        }
    });
    
    html += `</ol></nav>`;
    
    container.innerHTML = html;
}

// Inisialisasi otomatis saat seluruh struktur DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadLayout();
});