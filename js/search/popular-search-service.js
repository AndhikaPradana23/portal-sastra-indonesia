const PopularSearchService = {

    async getPopularSearches(){

        const {
            data,
            error
        } =
        await supabaseClient
            .from(
                "popular_searches"
            )
            .select("*")
            .limit(10);

        if(error){
            console.error(error);
            return [];
        }

        return data || [];

    }

};

window.PopularSearchService =
    PopularSearchService;