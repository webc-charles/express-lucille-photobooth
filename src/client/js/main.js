import Swiper from 'swiper';
import { Autoplay, EffectFade, Manipulation } from 'swiper/modules';

let swiper;


async function getImages() {
    const response = await fetch('/api/images');
    const images = await response.json();
    return images;
}

async function initializeSlider() {
    let currentImages = Array.from(document
        .getElementById('slideshow')
        .querySelectorAll('img')
        ).map(img => (
            { 
                url: img.src, 
                key: img.alt 
            }
        )
    );
    
    console.log({currentImages})

    swiper = new Swiper('#slideshow', {
        modules: [Autoplay, EffectFade, Manipulation],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        },
        speed: 500,
        loop: true,
        allowTouchMove: false,
        slidesPerView: 1,
        lazyLoading: true,
        lazyLoadingInPrevNext: true,
        preloadImages: false,
    });

    setInterval(async () => {
        const newImages = await getImages();
        
        // Filter out images that are already in the currentImages array
        const uniqueNewImages = newImages.filter(newImage => 
            !currentImages.some(currentImage => currentImage.key === newImage.key)
        );

        console.log({uniqueNewImages})

        if (uniqueNewImages.length > 0) {
            currentImages = [...currentImages, ...uniqueNewImages];
    
            const slides = uniqueNewImages.map(image => 
                `<div class="swiper-slide"><img src="${image.url}" alt="${image.key}"></div>`
            );

            swiper.appendSlide(slides);
        }
    }, 30000);
    
    return swiper;
}

document.addEventListener('DOMContentLoaded', () => {
    window.slider = initializeSlider();
});