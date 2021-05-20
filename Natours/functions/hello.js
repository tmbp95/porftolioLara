const axios = require("axios");
exports.handler = async function(event, context) {

    let folders = [];
    let mapFolder = [];
    let results = await axios.get("http://127.0.0.1:8080/img/gallery/");
    folders = results.data;

    let resultingFolders = await method(folders);
    resultingFolders.forEach((a, index) => {
        mapFolder.push({folderName: folders[index], data: a});
    })

    return {
        headers: {

            'Access-Control-Allow-Origin': '*',
    
            'Access-Control-Allow-Credentials': true,
    
        },
        statusCode: 200,
        body: JSON.stringify({message: folders, folders: mapFolder})
    }
}

const method = async function(folders) {
    let mapFolder = [];

    for(let i = 0; i < folders.length; i++){
        let result = axios.get("http://127.0.0.1:8080/img/gallery/" + folders[i]);
        result = await result;
        mapFolder.push(result.data);
    }

    return mapFolder;
}