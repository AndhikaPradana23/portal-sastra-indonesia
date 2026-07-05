function createPagination(
    current,
    totalPages
){

    let html =
        `<div class="pagination">`;

    for(
        let i = 1;
        i <= totalPages;
        i++
    ){

        html += `
            <button
                class="
                btn
                ${
                    i === current
                    ? "btn-primary"
                    : "btn-outline"
                }
                "
                data-page="${i}"
            >
                ${i}
            </button>
        `;

    }

    html +=
        "</div>";

    return html;
}

window.createPagination =
    createPagination;