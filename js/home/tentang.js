// =============================
// HOME SECTION: TENTANG PORTAL
// =============================

function renderTentangPortal() {
    return `
        <section class="home-section">
            <div class="container">
                <div class="tentang-grid">
                    <div>
                        <span class="section-label">
                            Tentang Portal
                        </span>
                        <h2>
                            Tentang Portal Sastra Indonesia
                        </h2>
                        <p>
                            Portal pembelajaran sastra Indonesia yang membantu siswa, mahasiswa, guru, dan peneliti.
                        </p>
                        <a
                            href="pages/tentang.html"
                            class="btn-primary"
                        >
                            Pelajari Selengkapnya
                        </a>
                    </div>

                    <div class="portal-feature-list">
                        <div>✓ Kamus Istilah</div>
                        <div>✓ Artikel</div>
                        <div>✓ Sastrawan</div>
                        <div>✓ Karya Sastra</div>
                        <div>✓ Analisis Puisi</div>
                        <div>✓ Generator Sitasi</div>
                        <div>✓ Kuis Sastra</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Ekspos fungsi ke global window agar bisa dipanggil di index.js atau file utama
window.renderTentangPortal = renderTentangPortal;