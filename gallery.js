/**
 * SreeMayil Gallery Page Logic
 * Features: Masonry rendering, fail-safe fallback fetch logic, year filtering, and smooth navigation lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fallback dataset in case fetch is blocked by local file access rules
    const fallbackGallery = [
        {
            "id": "img1",
            "year": "2026",
            "title": "Herbal Soap Training Batch 1",
            "image": "assets/images/gallery/soap.png"
        },
        {
            "id": "img2",
            "year": "2026",
            "title": "Premium Hair Oil Production",
            "image": "assets/images/gallery/hair-oil.png"
        },
        {
            "id": "img3",
            "year": "2025",
            "title": "Organic Farming Workshop",
            "image": "assets/images/gallery/farming.png"
        },
        {
            "id": "img4",
            "year": "2024",
            "title": "Traditional Wellness Siddha Camp",
            "image": "assets/images/training-classroom.jpg"
        }
    ];

    let galleryItems = [];
    let activeFilter = 'All';
    let filteredItems = [];
    let currentLightboxIndex = 0;

    const masonryContainer = document.getElementById('gallery-masonry');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Lightbox elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxYear = document.getElementById('lightbox-year');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // 2. Fetch logic with try/catch fail-safe fallback
    async function loadGalleryData() {
        try {
            const response = await fetch('gallery.json');
            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            galleryItems = await response.json();
        } catch (error) {
            console.warn('Unable to load gallery.json via fetch, using fallback dataset:', error);
            galleryItems = fallbackGallery;
        }
        applyFilter('All');
    }

    // 3. Render gallery cards into CSS columns layout
    function renderGallery() {
        if (!masonryContainer) return;
        masonryContainer.innerHTML = '';

        if (filteredItems.length === 0) {
            masonryContainer.innerHTML = `
                <div class="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <i data-lucide="image-off" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i>
                    <p class="text-gray-500 font-medium">No photos found in this category.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'break-inside-avoid mb-4 group relative overflow-hidden rounded-2xl border border-[#f1ece4] bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&w=600&q=80'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <span class="text-[10px] font-bold text-natureGreen-accent uppercase tracking-widest mb-1.5">${item.year}</span>
                    <h4 class="font-heading font-bold text-sm leading-snug">${item.title}</h4>
                </div>
            `;
            card.addEventListener('click', () => openLightbox(index));
            masonryContainer.appendChild(card);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // 4. Filtering algorithm
    function applyFilter(filter) {
        activeFilter = filter;
        
        // Update filter button active states
        filterButtons.forEach(btn => {
            const btnVal = btn.getAttribute('data-filter');
            if (btnVal === filter) {
                btn.className = "filter-btn px-6 py-2.5 rounded-full text-xs font-bold border-2 border-natureGreen bg-natureGreen text-white shadow-md transition-all";
            } else {
                btn.className = "filter-btn px-6 py-2.5 rounded-full text-xs font-bold border-2 border-gray-200 bg-white text-gray-600 hover:border-natureGreen hover:text-natureGreen transition-all";
            }
        });

        // Filter calculation
        if (filter === 'All') {
            filteredItems = [...galleryItems];
        } else {
            filteredItems = galleryItems.filter(item => item.year === filter);
        }

        renderGallery();
    }

    // Setup filter click listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // 5. Lightbox Functions
    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxContent();
        if (lightboxModal) {
            lightboxModal.classList.remove('hidden');
            lightboxModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('flex');
            lightboxModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function navigateLightbox(direction) {
        currentLightboxIndex = (currentLightboxIndex + direction + filteredItems.length) % filteredItems.length;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        const item = filteredItems[currentLightboxIndex];
        if (!item || !lightboxImage || !lightboxTitle || !lightboxYear) return;

        lightboxImage.src = item.image;
        lightboxImage.alt = item.title;
        lightboxTitle.textContent = item.title;
        lightboxYear.textContent = item.year;
    }

    // Event listener assignments for Lightbox Controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on backdrop click
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox accessibility
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox(1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
        }
    });

    // Start initialization
    loadGalleryData();
});
