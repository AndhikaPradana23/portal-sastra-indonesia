async function loadComponent(
    selector,
    file
){

    const element =
        document.querySelector(selector);

    if(!element){
        return;
    }

    try{

        const response =
            await fetch(file);

        element.innerHTML =
            await response.text();

    }

    catch(error){
        console.error(error);
    }

}

async function loadLayout(){

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

    // HAPUS: await loadBreadcrumb(); (karena merusak halaman indeks)
    
    initActiveMenu();

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