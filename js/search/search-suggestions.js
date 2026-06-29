const SearchSuggestionService = {

    async getSuggestions(
        keyword
    ){

        keyword =
            keyword
                .trim()
                .toLowerCase();

        if(!keyword){
            return [];
        }

        const suggestions =
            [];

        //
        // ISTILAH
        //
        const {
            data: istilah
        } =
        await supabaseClient
            .from("istilah")
            .select("nama")
            .ilike(
                "nama",
                `%${keyword}%`
            )
            .limit(5);

        (istilah || [])
            .forEach(item => {

                suggestions.push(
                    item.nama
                );

                suggestions.push(
                    `${item.nama} contoh`
                );

                suggestions.push(
                    `${item.nama} pengertian`
                );

            });

        //
        // SASTRAWAN
        //
        const {
            data: sastrawan
        } =
        await supabaseClient
            .from("sastrawan")
            .select("nama")
            .ilike(
                "nama",
                `%${keyword}%`
            )
            .limit(5);

        (sastrawan || [])
            .forEach(item => {

                suggestions.push(
                    item.nama
                );

                suggestions.push(
                    `${item.nama} biografi`
                );

                suggestions.push(
                    `${item.nama} karya`
                );

                suggestions.push(
                    `${item.nama} puisi`
                );

            });

        //
        // KARYA
        //
        const {
            data: karya
        } =
        await supabaseClient
            .from("karya")
            .select("judul")
            .ilike(
                "judul",
                `%${keyword}%`
            )
            .limit(5);

        (karya || [])
            .forEach(item => {

                suggestions.push(
                    item.judul
                );

                suggestions.push(
                    `${item.judul} sinopsis`
                );

                suggestions.push(
                    `${item.judul} analisis`
                );

            });

        return [
            ...new Set(
                suggestions
            )
        ].slice(
            0,
            10
        );

    }

};

window.SearchSuggestionService =
    SearchSuggestionService;