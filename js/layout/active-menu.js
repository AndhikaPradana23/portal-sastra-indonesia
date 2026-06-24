// =====================================
// ACTIVE MENU
// =====================================

function initActiveMenu(){

    const currentPath =
        window.location.pathname;

    const links =
        document.querySelectorAll(
            "nav a"
        );

    links.forEach(link=>{

        const href =
            new URL(
                link.href
            ).pathname;

        if(currentPath===href){

            link.classList.add(
                "active"
            );

        }

    });

}