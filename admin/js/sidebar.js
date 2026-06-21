// admin/js/sidebar.js

document.addEventListener("DOMContentLoaded", async () => {
    const sidebarContainer = document.getElementById("sidebar-container");
    
    if (!sidebarContainer) return;

    try {
        // 1. Ambil file komponen HTML sidebar
        const response = await fetch("sidebar.html");
        if (!response.ok) throw new Error("Gagal memuat komponen sidebar.");
        
        const html = await response.text();
        sidebarContainer.innerHTML = html;

        // 2. Logika Otomatis Memberikan Class 'active'
        // Mengambil nama file yang sedang aktif di URL (misal: "kategori.html")
        const currentPath = window.location.pathname.split("/").pop();
        
        // Cari semua link tautan di dalam sidebar yang baru di-inject
        const links = sidebarContainer.querySelectorAll("nav ul li a");
        
        links.forEach(link => {
            const href = link.getAttribute("href");
            
            // Jika nama file di URL cocok dengan nilai href, berikan class active
            if (currentPath === href) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // 3. Logika Fungsi Logout Otomatis
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                const yakin = confirm("Apakah Anda yakin ingin keluar dari panel admin?");
                if (!yakin) return;

                // Pastikan adminSupabase (dari file supabase.js) sudah terdefinisi secara global
                if (typeof adminSupabase !== "undefined") {
                    const { error } = await adminSupabase.auth.signOut();
                    if (error) {
                        alert("Gagal logout: " + error.message);
                    } else {
                        location.href = "login.html";
                    }
                } else {
                    // Fallback jika instansiasi Supabase menggunakan nama variabel lain (misal: supabase)
                    try {
                        await supabaseClient.auth.signOut();
                        location.href = "login.html";
                    } catch (e) {
                        console.error(e);
                        // Jika script supabase belum termuat sempurna, lakukan redirect manual
                        location.href = "login.html";
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error loading sidebar component:", error);
        sidebarContainer.innerHTML = `<p style="color: red; padding: 20px; font-weight: bold;">Gagal memuat navigasi menu.</p>`;
    }
});