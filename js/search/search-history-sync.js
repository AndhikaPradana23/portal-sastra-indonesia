const SearchHistorySync = {

    async save(
        keyword
    ){

        const session =
            await getSession();

        //
        // BELUM LOGIN
        //
        if(!session){

            let history =
                JSON.parse(
                    localStorage.getItem(
                        "guest_search_history"
                    )
                ) || [];

            history =
                history.filter(
                    item =>
                        item !== keyword
                );

            history.unshift(
                keyword
            );

            history =
                history.slice(
                    0,
                    10
                );

            localStorage.setItem(
                "guest_search_history",
                JSON.stringify(
                    history
                )
            );

            return;
        }

        //
        // LOGIN
        //
        await SearchHistoryService
            .saveSearchHistory(
                keyword
            );

    }

};

window.SearchHistorySync =
    SearchHistorySync;