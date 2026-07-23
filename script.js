/**
 * Christopher Juan Macrio — Dark Gaming / HUD Portfolio Scripts
 * Particles, Typing, Counter, Scroll Progress, Active Nav,
 * Mobile Menu, Skill Bars, Custom Cursor, Preloader, Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize AOS
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
    });

    // ==============================
    // PRELOADER
    // ==============================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 1900);
        });
        // Fallback in case load fires late
        setTimeout(() => preloader.classList.add('hide'), 3000);
    }

    // ==============================
    // PARTICLE SYSTEM (Crimson)
    // ==============================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.opacity = Math.random() * 0.45 + 0.05;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir * 0.003;
                if (this.opacity > 0.5) this.fadeDir = -1;
                if (this.opacity < 0.04) this.fadeDir = 1;
                if (this.x < -10 || this.x > canvas.width + 10 ||
                    this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                // Diamond shape for particles
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 4);
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.fillStyle = `rgba(230, 57, 70, ${this.opacity})`;
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 16000));
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        const opacity = (1 - dist / 110) * 0.1;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 200);
        });
    }

    // ==============================
    // TYPING EFFECT
    // ==============================
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const phrases = [
            'Web Developer',
            'UI/UX Designer',
            'Problem Solver',
            'Creative Coder',
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 40;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // ==============================
    // SCROLL PROGRESS BAR
    // ==============================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }, { passive: true });
    }

    // ==============================
    // CUSTOM CURSOR (Crimson)
    // ==============================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.14;
            outlineY += (mouseY - outlineY) * 0.14;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const interactables = document.querySelectorAll('a, button, .hover-glow, .award-item, .project-card, .stat-card, .btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '44px';
                cursorOutline.style.height = '44px';
                cursorOutline.style.borderColor = 'rgba(230, 57, 70, 0.6)';
                cursorOutline.style.backgroundColor = 'rgba(230, 57, 70, 0.05)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.borderColor = 'rgba(230, 57, 70, 0.4)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    // ==============================
    // NAVBAR: Scroll + Active Section
    // ==============================
    const navbar = document.getElementById('navbar');
    const navLinksEl = document.querySelectorAll('.nav-links a[data-section]');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksEl.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateActiveNav();
        }, { passive: true });
    }

    // ==============================
    // MOBILE MENU
    // ==============================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ==============================
    // SMOOTH SCROLL
    // ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 76;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ==============================
    // COUNTER ANIMATION (Stats)
    // ==============================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 1400;
            const startTime = performance.now();
            const suffix = '+';

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(ease * target);
                counter.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target + suffix;
                }
            }
            requestAnimationFrame(updateCount);
        });
        countersAnimated = true;
    }

    // ==============================
    // SKILL BAR ANIMATION
    // ==============================
    const skillBars = document.querySelectorAll('.skill-track-fill[data-width], .skill-track-glow[data-width], .skill-bar-fill[data-width]');
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width') + '%';
            }, Math.floor(index / 2) * 80);
        });
        skillBarsAnimated = true;
    }

    // ==============================
    // INTERSECTION OBSERVERS
    // ==============================
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

    const aboutSection = document.getElementById('about');
    if (aboutSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        statsObserver.observe(aboutSection);
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        skillsObserver.observe(skillsSection);
    }

    // ==============================
    // BACK TO TOP
    // ==============================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

/* ==========================================================================
   TAHAP 6: PORTFOLIO & ACHIEVEMENTS FILTER / MODAL LOGIC
   ========================================================================== */

function initPortfolio() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Modal Detail Project (Jika menggunakan modal)
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const projectTriggers = document.querySelectorAll('.view-project-btn');

    if (!modal) return;

    projectTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Ambil data dari atribut card
            const card = btn.closest('.project-card');
            if (!card) return;

            const title = card.querySelector('.project-title')?.textContent || 'Project Detail';
            const desc = card.getAttribute('data-desc') || 'Deskripsi detail project belum ditambahkan.';
            
            // Populate modal content
            const modalTitle = modal.querySelector('.modal-title');
            const modalBody = modal.querySelector('.modal-body');

            if (modalTitle) modalTitle.textContent = title;
            if (modalBody) modalBody.textContent = desc;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scroll
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    // Close modal on click outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

/* ==========================================================================
   TAHAP 7: FOOTER, CONTACT FORM, BACK TO TOP & APP INITIALIZATION
   ========================================================================== */

// Handle Contact Form / Mailto Trigger
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const messageInput = document.getElementById('formMessage');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !message) {
            alert('Harap isi nama dan pesan Anda terlebih dahulu.');
            return;
        }

        // Format pesan ke URL Mailto
        const subject = encodeURIComponent(`[Portfolio Contact] Pesan dari ${name}`);
        const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
        
        // Ganti email_tujuan@domain.com dengan email Anda
        window.location.href = `mailto:email_tujuan@domain.com?subject=${subject}&body=${body}`;

        // Reset Form
        contactForm.reset();
    });
}

// Back to Top Button Logic
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   MAIN SYSTEM INITIALIZER (DOM Loaded Event)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Panggil semua fungsi dari Tahap 1 - Tahap 7
    initPortfolio();
    initProjectModal();
    initContactForm();
    initBackToTop();
});
