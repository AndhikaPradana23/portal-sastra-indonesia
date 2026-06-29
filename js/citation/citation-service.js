function generateCitation(data){

    switch(data.style){

        case "apa":
            return formatAPA(data);

        case "mla":
            return formatMLA(data);

        case "chicago":
            return formatChicago(data);

        case "harvard":
            return formatHarvard(data);

        default:
            return "";
    }

}