const axios = require("axios");
exports.handler = async function(event, context) {
    folders.forEach(async (folder) => {
        let results2 = axios.get("http://127.0.0.1:8080/img/gallery/" + folder);
        results2 = await results2;

        mapFolder = "ola";
    });

    let results3 = axios.get("http://127.0.0.1:8080/img/gallery/");
    results3 = await results3;

    
    // const results2R = await mapFolder;

    return {
        headers: {

            'Access-Control-Allow-Origin': '*',
    
            'Access-Control-Allow-Credentials': true,
    
        },
        statusCode: 200,
        body: JSON.stringify({message: mapFolder})
    }
}

// xhr.responseType = 'document';
// xhr.onload = () => {
//     if (xhr.status === 200) {
//         var elements = xhr.response.getElementsByTagName("a");
//         for (let x of elements) {
//             if (x.href.match(/\/gallery\/.*/)){
//                 const folderName = x.href.replace(/.*\/gallery\//g,'');
//                 gallery.createFolder(folderName);
//             }
//         }
//         gallery.imagesMap.forEach((value, folder) => {
//             const xhr2 = new XMLHttpRequest();
//             xhr2.open("GET", "/img/gallery/" + folder, true);
//             xhr2.responseType = 'document';

//             xhr2.onload = () => {
//                 if (xhr2.status === 200) {
//                     var elements = xhr2.response.getElementsByTagName("a");
//                     for (let x of elements) {
//                         if ( x.href.match(/\.(jpe?g|png|gif)$/) ) { 
//                             teste += x.href;
//                             // gallery.appendToList(folder, x.href);
//                         }
//                     }
//                 } else {
//                     alert('Request failed. Returned status of ' + xhr.status);
//                 }
//                 // gallery.fillGallery();

//                 return  {
//                     headers: {

//                         'Access-Control-Allow-Origin': '*',
                  
//                         'Access-Control-Allow-Credentials': true,
                  
//                       },
//                     statusCode: 200,
//                     body: JSON.stringify({message: teste})
//                 }
//             };

//             xhr2.send();
//         });
//     } else {
//         alert('Request failed. Returned status of ' + xhr.status);
//     }
// }

// xhr.send();

// }