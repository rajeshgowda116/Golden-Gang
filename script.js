document.addEventListener('DOMContentLoaded', () => {
    // ---- Theme Engine ----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootHtml = document.documentElement;

    // Check saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    rootHtml.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootHtml.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            rootHtml.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
        });
    }

    // ---- Memories Gallery & Slideshow Modal Engine ----
    const galleryModal = document.getElementById('gallery-modal');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const galleryModalImg = document.getElementById('gallery-modal-img');
    const galleryModalTitle = document.getElementById('gallery-modal-title');
    const galleryCounter = document.getElementById('gallery-counter');
    const prevBtn = document.getElementById('prev-memory-btn');
    const nextBtn = document.getElementById('next-memory-btn');

    // Build Memories Array from DOM Items (works on both index.html and memories.html)
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item, .memory-card-box'));
    const memoryDataList = galleryItems.map(item => {
        const titleEl = item.querySelector('h3');
        return {
            title: item.getAttribute('data-title') || (titleEl ? titleEl.textContent : 'Memory'),
            imgSrc: item.getAttribute('data-img')
        };
    });

    let currentMemoryIndex = 0;

    function updateModalContent(index) {
        if (memoryDataList.length === 0) return;
        if (index < 0) index = memoryDataList.length - 1;
        if (index >= memoryDataList.length) index = 0;
        
        currentMemoryIndex = index;
        const currentData = memoryDataList[currentMemoryIndex];
        
        if (galleryModalTitle) galleryModalTitle.textContent = currentData.title;
        if (galleryModalImg) galleryModalImg.src = currentData.imgSrc;
        if (galleryCounter) {
            galleryCounter.textContent = `${currentMemoryIndex + 1} of ${memoryDataList.length}`;
        }
    }

    function openSlideshow(startIndex = 0) {
        if (!galleryModal) return;
        updateModalContent(startIndex);
        galleryModal.classList.add('active');
    }

    // Attach click to each gallery item / memory box
    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            openSlideshow(idx);
        });
    });

    // Attach click to polaroids on home page
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach(p => {
        p.addEventListener('click', () => {
            if (!galleryModal) return;
            const caption = p.getAttribute('data-caption') || 'Memory';
            const imgSrc = p.getAttribute('data-img');
            if (galleryModalTitle) galleryModalTitle.textContent = caption;
            if (galleryModalImg) galleryModalImg.src = imgSrc;
            if (galleryCounter) galleryCounter.textContent = 'Featured Memory';
            galleryModal.classList.add('active');
        });
    });

    // Prev / Next Navigation Click Handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateModalContent(currentMemoryIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateModalContent(currentMemoryIndex + 1);
        });
    }

    // Keyboard Arrow Keys Navigation
    document.addEventListener('keydown', (e) => {
        if (galleryModal && galleryModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                updateModalContent(currentMemoryIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateModalContent(currentMemoryIndex + 1);
            } else if (e.key === 'Escape') {
                galleryModal.classList.remove('active');
            }
        }
    });

    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.remove('active');
        });
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('active');
            }
        });
    }
});
