class Gallery {
    constructor(imagesArr){
        this.currentIndex = 0;
        this.current = undefined;
        this.imagesMap = new Map();
        this.imagesArr = imagesArr;
        this.imagesArrFiltered = imagesArr;
        this.imageIsOpen = false;
    }

    clearGallery() {
        this.imagesArrFiltered = [];
        document.querySelectorAll(`.gallery__section`).forEach(elem => elem.remove());
        document.querySelectorAll(`.gallery__nav-list--item:not([data-folderName="All"])`).forEach(elem => elem.remove());

        document.querySelector('.gallery__nav-list--item[data-folderName="All"]').classList.remove('gallery__nav-list--item-active');

    }

    fillGallery() {
        if(document.querySelectorAll(`.gallery__section`).length){
            this.clearGallery();
        }
        this.imagesMap.forEach((value, folderName) => {
            this.createFolder(folderName);
            this.appendListToGallery(folderName);
        });
        this.addFilters();
        this.markFilterAsActive('All');
    }

    appendListToGallery(folderName){
        this.imagesMap.get(folderName).forEach(element => {
            this.imagesArrFiltered.push(element);
            document.querySelector(`.gallery__section-${folderName}`).innerHTML += `
                <div class="item gallery__item">
                    <a href="#popup">
                        <img src="${element}" alt="Gallery image 1" class="gallery__img img${this.imagesArrFiltered.length}">
                    </a>
                </div>
            `;
        });
        setTimeout(() => waterfall(`.gallery__section-${folderName}`), 200);


        document.querySelectorAll('.gallery__item')
            .forEach(item => 
                item.addEventListener('click', (e) => 
                    {   
                        console.log(e.target.src)
                        gallery.open();
                        gallery.setCurrent(e.target.src);
                    }
                )
            );
    }

    findFolderByImage(imageSrc) {
        let folder = "";
        for (let [key, arr] of this.imagesMap.entries()) {
            arr.forEach(value => {
                if (value === imageSrc)
                folder = key;
                return;
            });
          }
          return folder;
    }

    appendToList(folderName, element){
        this.imagesArr.push(element);
        this.imagesMap.set(folderName, [...this.imagesMap.get(folderName), element]);
    }

    createFolder(folderName){
        if(!this.imagesMap.has(folderName)){
            this.imagesMap.set(folderName, []);
        }
        document.querySelector('.gallery').innerHTML += `
            <section class="gallery__section gallery__section-${folderName}"></section>
        `;
    }

    addFilters(){
        this.imagesMap.forEach((value, folderName) => {
            document.querySelector('.gallery__nav-list').innerHTML += `
                <li class="gallery__nav-list--item" data-folderName="${folderName}" onClick="gallery.filterImages('${folderName}')">
                    ${folderName}
                </li>
            `;
        })
    }

    filterImages(folderName){
        this.clearGallery();
        this.createFolder(folderName);
        this.appendListToGallery(folderName);
        this.addFilters();
        this.markFilterAsActive(folderName);
    }

    markFilterAsActive(folderName) {
        document.querySelector(`.gallery__nav-list--item[data-folderName="${folderName}"]`).classList.add('gallery__nav-list--item-active');
    }

    getImages(){
        return this.imagesArr;
    }

    setCurrent(element){
        this.current = element;
        this.setCurrentIndex(this.imagesArrFiltered.findIndex(el => el === this.current));
        this.changeImage(element);
    }

    setCurrentIndex(currentIndex){
        if(this.currentIndex >= 0 || this.currentIndex < this.imagesArrFiltered.length) {
            this.currentIndex = currentIndex;
        }
    }

    open() {
        this.imageIsOpen = true;
    }

    close() {
        this.imageIsOpen = false;
        document.querySelector('.popup__close').click();
    }

    prevImage(){
        if(this.currentIndex === 0) return;
        this.current = this.imagesArrFiltered[--this.currentIndex];
        this.changeImage(this.current);
    }

    nextImage() {
        if(this.currentIndex === this.imagesArrFiltered.length -1) return;
        this.current = this.imagesArrFiltered[++this.currentIndex];
        this.changeImage(this.current);
    }

    changeImage(newImage) {
        document.querySelector('.popup .popup__top-image').src = newImage;
        const folderName = this.findFolderByImage(newImage);
        this.setDescription(folderName);
    }

    setDescription(folderName) {
        document.querySelector('.popup .popup__bottom').innerHTML = folderName;
    }
}

window.gallery = new Gallery([]);

document.addEventListener('keyup', (e) => {
    if(e.keyCode === 27) {
        if(gallery.imageIsOpen) {
            gallery.close();
        }
    }

    if(e.keyCode === 37) {
        if(gallery.imageIsOpen) {
            gallery.prevImage();
        }
    }

    if(e.keyCode === 39) {
        if(gallery.imageIsOpen) {
            gallery.nextImage();
        }
    }
});

// document.addEventListener('load', gallery.close());

document.querySelector('.popup__buttons-prev').addEventListener('click', (e) => {
    gallery.prevImage()
});

document.querySelector('.popup__buttons-next').addEventListener('click', (e) => {
    gallery.nextImage()
});

document.querySelector('.popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.popup')) {
        gallery.close();
    }
});


const xhr = new XMLHttpRequest();
xhr.open("GET", "/img/gallery/", true);
xhr.responseType = 'document';
xhr.onload = () => {
    if (xhr.status === 200) {
        var elements = xhr.response.getElementsByTagName("a");
        for (let x of elements) {
            if (x.href.match(/\/gallery\/.*/)){
                const folderName = x.href.replace(/.*\/gallery\//g,'');
                gallery.createFolder(folderName);
            }
        }
        gallery.imagesMap.forEach((value, folder) => {
            const xhr2 = new XMLHttpRequest();
            xhr2.open("GET", "/img/gallery/" + folder, true);
            xhr2.responseType = 'document';

            xhr2.onload = () => {
                if (xhr2.status === 200) {
                    var elements = xhr2.response.getElementsByTagName("a");
                    for (let x of elements) {
                        if ( x.href.match(/\.(jpe?g|png|gif)$/) ) { 
                            gallery.appendToList(folder, x.href);
                        }
                    }
                } else {
                    alert('Request failed. Returned status of ' + xhr.status);
                }
                gallery.fillGallery();
            };

            xhr2.send();
        });
    } else {
        alert('Request failed. Returned status of ' + xhr.status);
    }
}

xhr.send();