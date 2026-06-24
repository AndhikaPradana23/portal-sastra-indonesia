// =====================================
// BOOKMARK BUTTON
// =====================================

async function initBookmarkButton(item){

    const button =

        document.getElementById(

            "bookmark-button"

        );

    if(!button){

        return;

    }

    updateBookmarkButton(

        button,

        await isBookmarked(item.slug)

    );

    button.onclick = async ()=>{

        const bookmarked =

            await toggleBookmark(item);

        updateBookmarkButton(

            button,

            bookmarked

        );

    };

}

function updateBookmarkButton(

    button,

    bookmarked

){

    if(bookmarked){

        button.innerHTML="★ Disimpan";

        button.classList.add(

            "bookmarked"

        );

    }

    else{

        button.innerHTML="☆ Simpan";

        button.classList.remove(

            "bookmarked"

        );

    }

}