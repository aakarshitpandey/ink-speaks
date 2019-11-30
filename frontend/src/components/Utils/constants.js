export const swiperParams = {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    spaceBetween: 30,
    // effect: 'coverflow',
    grabCusrsor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    keyboard: {
        enabled: true,
    },
    loopFillGroupWithBlank: true,
    /*coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
    }*/
}