class Gallery {
    constructor(imagesArr){
        this.currentIndex = 0;
        this.current = undefined;
        this.imagesArr = imagesArr;
        this.imageIsOpen = false;
    }

    appendToList(element){
        this.imagesArr.push(element);
        document.querySelector('.gallery').innerHTML += `
            <div class="item gallery__item">
                <a href="#popup">
                    <img src="${element}" alt="Gallery image 1" class="gallery__img img${this.imagesArr.length}">
                </a>
            </div>
        `;
        document.querySelector('.img' + this.imagesArr.length).addEventListener('load', () => {waterfall('.gallery')});

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

    getImages(){
        return this.imagesArr;
    }

    setCurrent(element){
        this.current = element;
        this.setCurrentIndex(this.imagesArr.findIndex(el => el === this.current));
        this.changeImage(element);
    }

    setCurrentIndex(currentIndex){
        if(this.currentIndex >= 0 || this.currentIndex < this.imagesArr.length) {
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
        this.current = this.imagesArr[--this.currentIndex];
        this.changeImage(this.current);
    }

    nextImage() {
        if(this.currentIndex === this.imagesArr.length -1) return;
        this.current = this.imagesArr[++this.currentIndex];
        this.changeImage(this.current);
    }

    changeImage(newImage) {
        document.querySelector('.popup .popup__top-image').src = newImage;
    }
}

const gallery = new Gallery([]);

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

document.querySelector('.popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.popup')) {
        gallery.close();
    }
});

var xhr = new XMLHttpRequest();
xhr.open("GET", "/img/gallery", true);
xhr.responseType = 'document';
xhr.onload = () => {
  if (xhr.status === 200) {
    var elements = xhr.response.getElementsByTagName("a");
    for (let x of elements) {
      if ( x.href.match(/\.(jpe?g|png|gif)$/) ) { 
        gallery.appendToList(x.href);
      } 
    }
  } 
  else {
    alert('Request failed. Returned status of ' + xhr.status);
  }
}
xhr.send();