document.addEventListener('DOMContentLoaded', () => {
    // Animação de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa todos os elementos com animação
    const animatedElements = document.querySelectorAll(
        '.intro-grid, .artista-grid, .galeria-item, .conexao-item, .opcao'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Efeito hover nos cards da galeria
    document.querySelectorAll('.galeria-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const img = this.querySelector('.galeria-img-placeholder');
            if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.5s ease';
            }
        });
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('.galeria-img-placeholder');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
});
