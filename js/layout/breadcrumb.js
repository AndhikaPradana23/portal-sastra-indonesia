// =====================================
// BREADCRUMB
// =====================================

async function loadBreadcrumb(){

    const target =
        document.querySelector(
            "#site-breadcrumb"
        );

    if(!target){

        return;

    }

    const response =
        await fetch(
            "/components/breadcrumb.html"
        );

    target.innerHTML =
        await response.text();

}

function renderBreadcrumb(items){

    const list =
        document.getElementById(
            "breadcrumb-list"
        );

    if(!list){

        return;

    }

    list.innerHTML="";

    items.forEach((item,index)=>{

        const li =
            document.createElement("li");

        if(index===items.length-1){

            li.innerHTML=`

                <span>

                    ${item.label}

                </span>

            `;

        }

        else{

            li.innerHTML=`

                <a href="${item.href}">

                    ${item.label}

                </a>

            `;

        }

        list.appendChild(li);

    });

}