async function getIstilahQuizData(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from("istilah")
        .select(`
            id,
            nama,
            definisi
        `);

    if(error){

        console.error(error);
        return [];

    }

    return data || [];

}

async function getSastrawanQuizData(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from("sastrawan")
        .select(`
            id,
            nama,
            karya_terkenal
        `);

    if(error){

        console.error(error);
        return [];

    }

    return data || [];

}

async function getKaryaQuizData(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from("karya")
        .select(`
            id,
            judul,
            penulis
        `);

    if(error){

        console.error(error);
        return [];

    }

    return data || [];

}

window.QuizService = {
    getIstilahQuizData,
    getSastrawanQuizData,
    getKaryaQuizData
};