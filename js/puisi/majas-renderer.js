function renderMajas(
    hasil
){

    if(
        !hasil.length
    ){

        return `
            <p>
                Tidak ditemukan
                indikasi majas.
            </p>
        `;
    }

    return `
        <ul
            class="
            majas-list
            "
        >

            ${
                hasil
                    .map(item => `
                        <li>

                            <strong>
                                ${
                                    capitalize(
                                        item.nama
                                    )
                                }
                            </strong>

                            <br>

                            <small>

                                Indikator:
                                "${item.indikator}"

                            </small>

                        </li>
                    `)
                    .join("")
            }

        </ul>
    `;

}

function capitalize(text){

    return (
        text.charAt(0)
        .toUpperCase()
        +
        text.slice(1)
    );

}

window.renderMajas =
    renderMajas;