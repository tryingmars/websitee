// ============================================
// FUTURISTIC PERSONAL WEBSITE - INTERACTIONS
// ============================================

// --- SCROLL TO TOP ON REFRESH ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- SCROLL REVEAL ANIMATIONS ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
});

// --- TYPING ANIMATION ---
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typing animation to hero subtitle on load
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 50);
    }
});

// --- DYNAMIC GRADIENT BACKGROUND ---
let mouseX = 0;
let mouseY = 0;
let isParallaxRunning = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (!isParallaxRunning) {
        window.requestAnimationFrame(() => {
            // Subtle parallax effect on background
            const bgElement = document.body;
            const moveX = mouseX * 20;
            const moveY = mouseY * 20;

            bgElement.style.backgroundPosition = `${moveX}px ${moveY}px`;
            isParallaxRunning = false;
        });
        isParallaxRunning = true;
    }
});

// --- SKILL CARD HOVER EFFECTS ---
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// --- PROJECT CARD INTERACTIONS ---
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const tags = this.querySelectorAll('.tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.1)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function () {
            const tags = this.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.transform = 'scale(1)';
            });
        });
    });
});

// --- SOCIAL LINK ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach((link, index) => {
        // Stagger animation on load
        link.style.animationDelay = `${index * 0.1}s`;
        link.classList.add('fade-in');

        // Hover glow effect
        link.addEventListener('mouseenter', function () {
            this.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.6)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.boxShadow = '';
        });
    });
});

// --- PERFORMANCE: Reduce animations on low-end devices ---
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// --- CURSOR TRAIL EFFECT (Optional Enhancement) ---
const createCursorTrail = () => {
    let cursorTrail = [];
    const maxTrailLength = 10;

    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);

        cursorTrail.push(trail);

        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 300);
        }, 100);
    });
};

// Uncomment to enable cursor trail
// createCursorTrail();

console.log('🚀 Futuristic Personal Website Loaded!');
