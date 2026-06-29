function createSearchGroups(data){

    return [

        {
            id: "sastrawan",
            icon: "👤",
            title: "Sastrawan",
            field: "nama",
            url: "/sastrawan/detail.html?slug=",
            items: data.sastrawan
        },

        {
            id: "karya",
            icon: "📖",
            title: "Karya Sastra",
            field: "judul",
            url: "/karya-sastra/detail.html?slug=",
            items: data.karya
        },

        {
            id: "artikel",
            icon: "📰",
            title: "Artikel",
            field: "judul",
            url: "/artikel/detail.html?slug=",
            items: data.artikel
        },

        {
            id: "istilah",
            icon: "📚",
            title: "Istilah",
            field: "nama",
            url: "/kamus-istilah/detail.html?slug=",
            items: data.istilah
        }

    ];

}

window.createSearchGroups =
    createSearchGroups;