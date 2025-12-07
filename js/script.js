document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // HERO SLIDESHOW
    // ===================================

    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    let currentHeroSlide = 0;
    let heroInterval;

    function showHeroSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroSlides[index].classList.add('active');
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    // Auto advance hero slides
    function startHeroSlideshow() {
        // Only start if there are multiple slides
        if (heroSlides.length > 1) {
             heroInterval = setInterval(nextHeroSlide, 5000);
        }
    }

    function stopHeroSlideshow() {
        clearInterval(heroInterval);
    }

    if (heroNext && heroPrev) {
        heroNext.addEventListener('click', function() {
            nextHeroSlide();
            stopHeroSlideshow();
            startHeroSlideshow();
        });

        heroPrev.addEventListener('click', function() {
            prevHeroSlide();
            stopHeroSlideshow();
            startHeroSlideshow();
        });
    }

    // Start slideshow
    if (heroSlides.length > 0) {
        showHeroSlide(currentHeroSlide); // Ensure the first slide is visible
        startHeroSlideshow();
    }

// ===================================
    // Radio
    // ===================================
const radio = document.getElementById("radio");
const playBtn = document.getElementById("playBtn");
const btnTime = document.getElementById("btnTime");
const icon = document.getElementById("icon");

let seconds = 0;
let timer = null;

// Format HH:MM:SS
function formatTime(sec) {
    let h = Math.floor(sec / 3600).toString().padStart(2, '0');
    let m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    let s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        btnTime.textContent = formatTime(seconds);
    }, 1000);
}

// Stop timer
function stopTimer() {
    clearInterval(timer);
}

playBtn.addEventListener("click", () => {
    if (radio.paused) {
        radio.play();
        icon.textContent = "⏸";       // only change icon
        startTimer();
    } else {
        radio.pause();
        icon.textContent = "▶";
        stopTimer();
    }
});

// Reset on end
radio.addEventListener("ended", () => {
    stopTimer();
    seconds = 0;
    btnTime.textContent = "00:00:00";
    icon.textContent = "▶";
});

    // ===================================
    // NAVIGATION
    // ===================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        // Select all sections (excluding the hero section, which is handled implicitly)
        const sections = document.querySelectorAll('section[id]:not(#hero)');
        const scrollPosition = window.scrollY + 100;

        // Special handling for the Hero section
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;

        if (window.scrollY < heroHeight - 100) {
            // If near the top, make the Home link active
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#hero` || link.getAttribute('href') === `#home`) {
                    link.classList.add('active');
                }
            });
            return;
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===================================
    // DARK MODE TOGGLE
    // ===================================

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            body.classList.add('theme-dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', function() {
            body.classList.toggle('theme-dark');

            // Update icon
            if (body.classList.contains('theme-dark')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ===================================
    // GALLERY FILTER + SEE MORE
    // ===================================

    const filterBtns = document.querySelectorAll(".filter-btn");
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    let visibleRows = 2;

    function getItemsPerRow() {
        if (window.innerWidth <= 576) return 1; // mobile
        if (window.innerWidth <= 992) return 2; // tablet
        return 3; // desktop
    }

    function updateGallery() {
        const itemsPerRow = getItemsPerRow();
        const activeFilter = document.querySelector(".filter-btn.active") ? document.querySelector(".filter-btn.active").dataset.filter : 'all';

        const filtered = galleryItems.filter(item =>
            activeFilter === "all" || item.dataset.category === activeFilter
        );

        // 1. Hide ALL items first.
        galleryItems.forEach(item => item.style.display = "none");

        // 2. Show only the visible slice of the filtered items.
        const visibleCount = visibleRows * itemsPerRow;
        filtered.slice(0, visibleCount).forEach(item => {
            item.style.display = "block";
        });

        // 3. Update the 'See More' button visibility and text.
        const hasMore = filtered.length > visibleCount;

        // Show the button only if there are more than the initial 2 rows of images
        if (filtered.length > 2 * itemsPerRow && loadMoreBtn) {
            loadMoreBtn.style.display = "inline-block";
            loadMoreBtn.textContent = hasMore ? "See More" : "See Less";
        } else if (loadMoreBtn) {
             loadMoreBtn.style.display = "none";
        }


        updateVisibleImages(); // Update lightbox list
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Reset visible rows and update gallery
            visibleRows = 2; // Always reset to 2 rows when changing filter
            updateGallery();
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            const itemsPerRow = getItemsPerRow();
            const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;
            const filtered = galleryItems.filter(item =>
                activeFilter === "all" || item.dataset.category === activeFilter
            );

            const maxVisibleCount = visibleRows * itemsPerRow;

            if (maxVisibleCount >= filtered.length) {
                // Current state is 'See Less' -> Reset to initial 2 rows
                visibleRows = 2;
            } else {
                // Current state is 'See More' -> Load 2 more rows
                visibleRows += 2;
            }

            updateGallery();
        });
    }

    window.addEventListener("resize", updateGallery);
    // Initial call is moved to the INITIALIZE section at the bottom to ensure
    // all gallery variables and functions are defined first.


    // ===================================
    // LIGHTBOX (VIEW BUTTON FIX IS HERE)
    // ===================================

    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    let visibleImages = [];

    /**
     * Refreshes the list of images currently visible in the grid (after filtering/loading).
     */
    function updateVisibleImages() {
        // Collect all image containers that are currently displayed
        visibleImages = galleryItems.filter(item => item.style.display !== 'none');
    }

    /**
     * Loads the image into the lightbox based on its index in the visibleImages array.
     */
    function showLightboxImage(index) {
        if (visibleImages.length === 0) return;

        // Ensure index wraps around (circular navigation)
        currentImageIndex = (index + visibleImages.length) % visibleImages.length;

        // Get the image source from the data-src attribute of the view-btn inside the current item
        const currentItem = visibleImages[currentImageIndex];
        const imgSrc = currentItem.querySelector('.view-btn').getAttribute('data-src');
        lightboxImg.src = imgSrc;

        // Show/Hide prev/next buttons only if there's more than one image
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.style.display = visibleImages.length > 1 ? 'flex' : 'none';
            lightboxNext.style.display = visibleImages.length > 1 ? 'flex' : 'none';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
        }
    }

    // 1. Handle opening the lightbox via Event Delegation
    if (galleryGrid && lightbox) {
        galleryGrid.addEventListener('click', function(e) {
            const clickedButton = e.target.closest('.view-btn');

            if (clickedButton) {
                e.preventDefault();
                e.stopPropagation();

                // 2. Refresh the list of visible images
                updateVisibleImages();

                // 3. Find the parent item and its index in the visible list
                const parentItem = clickedButton.closest('.gallery-item');
                currentImageIndex = visibleImages.indexOf(parentItem);

                // 4. Open the lightbox
                showLightboxImage(currentImageIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // 2. Add Navigation Event Listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            showLightboxImage(currentImageIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            showLightboxImage(currentImageIndex + 1);
        });
    }

    // Close lightbox on overlay click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || (lightboxClose && e.target === lightboxClose)) {
                closeLightbox();
            }
        });
    }

    // Close lightbox with ESC key and handle arrow key navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            // Handle navigation with arrow keys
            if (e.key === 'ArrowLeft') {
                 showLightboxImage(currentImageIndex - 1);
            }
            if (e.key === 'ArrowRight') {
                 showLightboxImage(currentImageIndex + 1);
            }
        }
    });


    // ===================================
    // CONTACT FORM
    // ===================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Show success message (in a real application, this would send data to a server)
            alert('Thank you for your message! I will get back to you soon.');

            // Reset form
            contactForm.reset();

            // Remove focus from inputs to reset labels
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.blur();
            });
        });
    }

    // ===================================
    // SMOOTH SCROLL
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                // Subtract 80px to account for the fixed header
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ===================================

    const observerOptions = {
        threshold: 0.1, // Element is considered visible when 10% is in view
        rootMargin: '0px 0px -50px 0px' // Start checking 50px before the bottom of the viewport
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once it's animated to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections (excluding hero which is visible immediately)
    document.querySelectorAll('.section:not(#hero)').forEach(section => {
        // Set initial state for CSS transition
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ===================================
    // INITIALIZE
    // ===================================

    // Initialize gallery display and set initial active filter
    updateGallery();

    // Initialize visible images for lightbox (This runs inside updateGallery, but calling it here ensures it's populated on load)
    updateVisibleImages();

    // Set initial active nav link
    updateActiveNavLink();

    console.log('Photography Portfolio - Ready!');
});