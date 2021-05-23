const fs = require("fs");

exports.handler = async function(event, context) {

    const files = fs.readdirSync('./img/gallery');
    let folders = [];
    let mapFolder = [];
    files.forEach((folder) => {
        let results = fs.readdirSync('./img/gallery/' + folder).filter(result => (/\./).test(result));
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
        body: JSON.stringify({folders: mapFolder})
    }
}