async function initBookmarkPage(){

    const bookmarks =

        await getBookmarks();

    renderBookmarkList(

        bookmarks

    );

}