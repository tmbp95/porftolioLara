const axios = require("axios");

const fs = require("fs");



let url = ".";
exports.handler = async function(event, context) {

    const files = fs.readdirSync('./img/gallery/');
    let folders = [];
    let mapFolder = [];
    files.forEach((folder) => {
        let results = fs.readdirSync('./img/gallery/' + folder);
        folders.push(results);
    });
    folders.forEach((a, index) => {
        mapFolder.push({folderName: files[index], data: a});
    })

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify({message: files, folders: mapFolder})
    }
}

const method = async function(folders) {
    let mapFolder = [];

    for(let i = 0; i < folders.length; i++){
        let result = axios.get(url + "/img/gallery/" + folders[i]);
        result = await result;
        mapFolder.push(result.data);
    }

    return mapFolder;
}