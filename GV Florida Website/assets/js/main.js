// GV Florida Transport - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name') || contactForm.querySelector('[placeholder*="Name"]')?.value;
            const email = formData.get('email') || contactForm.querySelector('[type="email"]')?.value;
            const message = formData.get('message') || contactForm.querySelector('textarea')?.value;

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            // Show success message
            showToast('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Toast notification
    function showToast(message, type) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification toast-' + type;
        toast.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + message;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10001;padding:16px 24px;border-radius:8px;color:#fff;font-family:Poppins,sans-serif;font-size:0.95rem;box-shadow:0 4px 20px rgba(0,0,0,0.2);animation:fadeInDown 0.4s ease;max-width:400px;display:flex;align-items:center;gap:10px;';
        toast.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.animation = 'fadeInUp 0.4s ease reverse'; setTimeout(() => toast.remove(), 400); }, 4000);
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .route-card, .terminal-card, .destination-item, .gallery-item, .info-card, .vm-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// =============================================
// LIGHTBOX - Gallery image viewer
// =============================================
let currentLightboxIndex = 0;
let galleryImages = [];

function openLightbox(item) {
    const img = item.querySelector('img');
    if (!img) return;

    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    currentLightboxIndex = galleryImages.indexOf(img);

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(event) {
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

function navigateLightbox(event, direction) {
    event.stopPropagation();
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;

    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg && galleryImages[currentLightboxIndex]) {
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
        lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') navigateLightbox(e, -1);
    if (e.key === 'ArrowRight') navigateLightbox(e, 1);
});
