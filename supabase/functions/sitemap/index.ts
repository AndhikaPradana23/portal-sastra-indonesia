import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async () => {
    // Menginisialisasi klien Supabase menggunakan Environment Variables internal
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // SEMENTARA: Ganti dengan domain produksi Anda nanti jika sudah rilis
    const baseUrl = "https://portalsastra.id"; 
    const urls = [];

    // 1. URL Statis (Beranda & Halaman Utama Kategori)
    urls.push({ loc: `${baseUrl}/` });
    urls.push({ loc: `${baseUrl}/kamus/` });
    urls.push({ loc: `${baseUrl}/artikel/` });
    urls.push({ loc: `${baseUrl}/karya-sastra/` });
    urls.push({ loc: `${baseUrl}/sastrawan/` });

    // 2. Ambil data Slug dari tabel Istilah
    const { data: istilah } = await supabase.from("istilah").select("slug");
    istilah?.forEach(item => {
        urls.push({ loc: `${baseUrl}/kamus/detail.html?slug=${item.slug}` });
    });

    // 3. Ambil data Slug dari tabel Artikel
    const { data: artikel } = await supabase.from("artikel").select("slug");
    artikel?.forEach(item => {
        urls.push({ loc: `${baseUrl}/artikel/detail.html?slug=${item.slug}` });
    });

    // 4. Ambil data Slug dari tabel Karya
    const { data: karya } = await supabase.from("karya").select("slug");
    karya?.forEach(item => {
        urls.push({ loc: `${baseUrl}/karya-sastra/detail.html?slug=${item.slug}` });
    });

    // 5. Ambil data Slug dari tabel Sastrawan
    const { data: sastrawan } = await supabase.from("sastrawan").select("slug");
    sastrawan?.forEach(item => {
        urls.push({ loc: `${baseUrl}/sastrawan/detail.html?slug=${item.slug}` });
    });

    // 6. Menyusun struktur teks XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    urls.forEach(item => {
        xml += `<url>\n  <loc>${item.loc}</loc>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>\n`;
    });

    xml += `</urlset>`;

    // 7. Kembalikan respons dalam bentuk format XML asli
    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8"
        }
    });
});