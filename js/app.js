document.addEventListener('DOMContentLoaded', () => {
    // Configuração de Animação de Entrada GSAP
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Anima o Header descendo
    tl.from('.main-header', {
        y: -100,
        opacity: 0,
        duration: 1.2
    });

    // Anima os textos do Hero sequencialmente
    tl.from('.subtitle-hero', {
        x: -50,
        opacity: 0,
        duration: 0.8
    }, '-=0.6');

    tl.from('.title-hero', {
        y: 30,
        opacity: 0,
        duration: 1
    }, '-=0.6');

    tl.from('.description-hero', {
        opacity: 0,
        duration: 1
    }, '-=0.6');

    tl.from('.hero-buttons a', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    }, '-=0.6');
});
