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
        document.querySelectorAll(`.gallery__item`).forEach(elem => elem.remove());
        document.querySelectorAll(`.gallery__nav-list--item:not([data-folderName="All"])`).forEach(elem => elem.remove());

        document.querySelector('.gallery__nav-list--item[data-folderName="All"]').classList.remove('gallery__nav-list--item-active');

    }

    fillGallery() {
        if(document.querySelectorAll(`.gallery__item`).length){
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
            document.querySelector(`.gallery__photos`).innerHTML += `
                <div class="item gallery__item">
                    <a href="#popup">
                        <img data-src="${element}" src="${element.replace(folderName,folderName + "/LowRes")}" alt="Gallery image 1" class="lazy gallery__img img${this.imagesArrFiltered.length}">
                    </a>
                </div>
            `;
            var myLazyLoad = new LazyLoad();
            // After your content has changed...
            myLazyLoad.update();
            waterfall('.gallery__photos');
        });

        document.querySelectorAll('.gallery__item')
            .forEach(item => 
                item.addEventListener('click', (e) => 
                    {   
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
        // document.querySelector('.gallery').innerHTML += `
        //     <section class="gallery__section gallery__section-${folderName}"></section>
        // `;
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
        this.setCurrentIndex(this.imagesArrFiltered.findIndex(el => el === this.current.replace(/.*\/img/g,"/img")));
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
        const folderName = this.findFolderByImage(newImage.replace(/.*\/img/g,"/img"));
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

document.addEventListener('load', gallery.close());

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

let url = "";

const xhr = new XMLHttpRequest();
xhr.open("GET", url + "/files.json", true);
xhr.responseType = 'json';
xhr.onload = () => {
    if (xhr.status === 200) {
        const foldersMap = xhr.response.folders;
        foldersMap.forEach(folderMap => {
            gallery.createFolder(folderMap.folderName);
            folderMap.data.forEach(imageSrc => {
                gallery.appendToList(folderMap.folderName, '/img/gallery/' + folderMap.folderName + '/' + imageSrc);
            })
        })

        gallery.fillGallery();
    } else {
        alert('Request failed. Please refresh the page');
    }
}

xhr.send(); 

setTimeout(() => {
    imgStatus.watch('.gallery__img', function(imgs){
        if(imgs.isDone()) {
            document.querySelector('.gallery__photos').style.display = 'block';
            waterfall('.gallery__photos');
            document.querySelector('.spinner').style.display = 'none';
        }
    });
}, 1000);