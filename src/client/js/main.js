import Swiper from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';

let swiper;

let currentImages = [];

async function getImages() {
    const response = await fetch('/api/images');
    const images = await response.json();
    return images;
  }

async function updateSlides() {
    const newImages = await getImages();
    
    if (JSON.stringify(newImages) !== JSON.stringify(currentImages)) {
        currentImages = newImages;
        
        const swiperWrapper = document.querySelector('.swiper-wrapper');

        swiperWrapper.innerHTML = newImages.map(image => 
            `<div class="swiper-slide"><img src="${image.url}" alt="${image.key}"></div>`
        ).join('');
        
        if (swiper) {
            swiper.update();
        }
    }
}

function initializeSlider() {
    swiper = new Swiper('#slideshow', {
        modules: [Autoplay, EffectFade],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        },
        speed: 1000,
        loop: true,
        allowTouchMove: false,
        slidesPerView: 1,
    });

    setInterval(updateSlides, 30000);
    
    return swiper;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('initializing slider...');
    window.slider = initializeSlider();
    console.log('Slider initialized', window.slider);
});