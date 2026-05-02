/**
 * Sreemayil Lifestyle Centre - Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navbar logic (Fixed state removed for static behavior)
    const navbar = document.getElementById('navbar');
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.replace('opacity-100', 'opacity-0'));
            dots.forEach(dot => {
                dot.classList.remove('bg-natureGreen', 'scale-125');
                dot.classList.add('bg-white/40');
            });

            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.replace('opacity-0', 'opacity-100');
            dots[currentSlide].classList.remove('bg-white/40');
            dots[currentSlide].classList.add('bg-natureGreen', 'scale-125');
        };

        const startAutoPlay = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
        };

        if (prevBtn) prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startAutoPlay();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            startAutoPlay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoPlay();
            });
        });

        startAutoPlay();
    }
});
