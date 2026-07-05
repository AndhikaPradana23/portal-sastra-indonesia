function renderResultCount(
    element,
    total,
    label
){

    element.innerHTML = `
        <div
            class="
            result-count
            "
        >
            Menampilkan
            ${total}
            ${label}
        </div>
    `;
}

window.renderResultCount =
    renderResultCount;