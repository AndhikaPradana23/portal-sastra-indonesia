function formatAPA(data){

    return `
${data.author}
(${data.year}).
${data.title}.
${data.publisher}.
${data.url}
`;

}

function formatMLA(data){

    return `
${data.author}.
"${data.title}."
${data.publisher},
${data.year},
${data.url}
`;

}

function formatChicago(data){

    return `
${data.author}.
${data.title}.
${data.publisher},
${data.year}.
${data.url}
`;

}

function formatHarvard(data){

    return `
${data.author}
(${data.year})
${data.title},
${data.publisher},
Available at:
${data.url}
`;

}