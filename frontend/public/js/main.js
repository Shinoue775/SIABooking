// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        let isOpen = false;
        const spans = mobileMenuBtn.querySelectorAll('span');
        
        mobileMenuBtn.addEventListener('click', function() {
            isOpen = !isOpen;
            
            if (isOpen) {
                mobileMenu.classList.remove('max-h-0', 'opacity-0');
                mobileMenu.classList.add('max-h-64', 'opacity-100');
                spans[0].classList.add('rotate-45', 'top-2');
                spans[1].classList.add('opacity-0');
                spans[2].classList.add('-rotate-45', 'top-2');
            } else {
                mobileMenu.classList.remove('max-h-64', 'opacity-100');
                mobileMenu.classList.add('max-h-0', 'opacity-0');
                spans[0].classList.remove('rotate-45', 'top-2');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', 'top-2');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});