async function migrateBookmarks(){

    const local =
        getBookmarksFromStorage();

    if(
        !local.length
    ){

        return;
    }

    for(
        const item
        of local
    ){

        await addBookmark(
            item.tipe,
            item.item_id
        );

    }

    clearBookmarks();

}