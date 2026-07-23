/**
 * Christopher Juan Macrio — Cinematic Dark Fantasy Portfolio
 * Full Script: Preloader, Particles, AOS, Custom Cursor,
 * Navbar, Mobile Menu, Smooth Scroll, Counters, Skill Bars,
 * Parallax, Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // INIT LUCIDE ICONS
    // ─────────────────────────────────────────────
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ─────────────────────────────────────────────
    // INIT AOS
    // ─────────────────────────────────────────────
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 750,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
    }

    // ─────────────────────────────────────────────
    // PRELOADER
    // ─────────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => preloader.classList.add('hide');
        window.addEventListener('load', () => setTimeout(hidePreloader, 1800));
        setTimeout(hidePreloader, 3500); // fallback
    }

    // ─────────────────────────────────────────────
    // PARTICLE SYSTEM
    // ─────────────────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrameId;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width  = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() { this.reset(); }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.6 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.1; // slight upward drift
                this.opacity = Math.random() * 0.4 + 0.05;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
                // Occasionally gold ember vs crimson
                this.isEmber = Math.random() < 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir * 0.003;
                if (this.opacity > 0.45) this.fadeDir = -1;
                if (this.opacity < 0.03) this.fadeDir = 1;
                if (this.x < -10 || this.x > canvas.width + 10 ||
                    this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                    this.y = canvas.height + 5; // respawn from bottom
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 4);
                ctx.beginPath();
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                const color = this.isEmber
                    ? `rgba(255, 107, 53, ${this.opacity})`
                    : `rgba(230, 57, 70, ${this.opacity})`;
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 14000));
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const opacity = (1 - dist / 100) * 0.08;
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
            animFrameId = requestAnimationFrame(animateParticles);
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

    // ─────────────────────────────────────────────
    // SCROLL PROGRESS BAR
    // ─────────────────────────────────────────────
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }, { passive: true });
    }

    // ─────────────────────────────────────────────
    // CUSTOM CURSOR
    // ─────────────────────────────────────────────
    const cursorDot     = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (cursorDot && cursorOutline && isFinePointer) {
        let mouseX = 0, mouseY = 0, outX = 0, outY = 0;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top  = `${mouseY}px`;
        });

        (function animateCursor() {
            outX += (mouseX - outX) * 0.14;
            outY += (mouseY - outY) * 0.14;
            cursorOutline.style.left = `${outX}px`;
            cursorOutline.style.top  = `${outY}px`;
            requestAnimationFrame(animateCursor);
        })();

        const interactables = document.querySelectorAll(
            'a, button, .hero-float-card, .award-cin-item, .skill-card-cin, .featured-project-banner, .btn'
        );
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width  = '48px';
                cursorOutline.style.height = '48px';
                cursorOutline.style.borderColor = 'rgba(230,57,70,0.65)';
                cursorOutline.style.backgroundColor = 'rgba(230,57,70,0.06)';
                cursorDot.style.transform = 'translate(-50%,-50%) scale(1.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width  = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.borderColor = 'rgba(230,57,70,0.4)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
            });
        });
    } else {
        if (cursorDot)     cursorDot.style.display     = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    // ─────────────────────────────────────────────
    // NAVBAR: scroll state + active section highlight
    // ─────────────────────────────────────────────
    const navbar    = document.getElementById('navbar');
    const navLinks  = document.querySelectorAll('.nav-links a[data-section]');
    const sections  = document.querySelectorAll('section[id], header[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) link.classList.add('active');
                });
            }
        });
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            updateActiveNav();
        }, { passive: true });
        updateActiveNav();
    }

    // ─────────────────────────────────────────────
    // MOBILE MENU
    // ─────────────────────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ─────────────────────────────────────────────
    // SMOOTH SCROLL
    // ─────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                const navH = document.querySelector('.navbar')?.offsetHeight || 72;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - navH,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─────────────────────────────────────────────
    // COUNTER ANIMATION
    // ─────────────────────────────────────────────
    const counters = document.querySelectorAll('.stat-cin-number[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        counters.forEach(el => {
            const target   = parseInt(el.getAttribute('data-count'), 10);
            const duration = 1500;
            const start    = performance.now();
            const suffix   = el.querySelector('span')?.textContent || '+';

            // Store the span reference
            const spanEl = el.querySelector('span');

            function tick(now) {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease     = 1 - Math.pow(1 - progress, 3);
                const current  = Math.floor(ease * target);

                // Set text while preserving the suffix span
                el.childNodes[0].nodeValue = current;

                if (progress < 1) requestAnimationFrame(tick);
                else if (el.childNodes[0]) el.childNodes[0].nodeValue = target;
            }
            requestAnimationFrame(tick);
        });
    }

    // ─────────────────────────────────────────────
    // SKILL BAR ANIMATION
    // ─────────────────────────────────────────────
    const skillBars      = document.querySelectorAll('.skill-track-fill-cin[data-width]');
    const statBars       = document.querySelectorAll('.stat-cin-bar-fill[data-width]');
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBarsAnimated = true;
        [...skillBars, ...statBars].forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width') + '%';
            }, index * 60);
        });
    }

    // ─────────────────────────────────────────────
    // INTERSECTION OBSERVERS
    // ─────────────────────────────────────────────
    const ioOptions = { threshold: 0.2, rootMargin: '0px 0px -40px 0px' };

    const aboutSection = document.getElementById('about');
    if (aboutSection && counters.length) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) animateCounters();
        }, ioOptions).observe(aboutSection);
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection && skillBars.length) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) animateSkillBars();
        }, ioOptions).observe(skillsSection);
    }

    // ─────────────────────────────────────────────
    // BACK TO TOP
    // ─────────────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ─────────────────────────────────────────────
    // HERO PARALLAX (subtle mouse-move on portrait)
    // ─────────────────────────────────────────────
    const heroSection  = document.getElementById('home');
    const heroFrame    = document.getElementById('heroFocal');
    const heroBgGlow   = document.querySelector('.hero-bg-glow');
    const heroBgGlow2  = document.querySelector('.hero-bg-glow-2');

    if (heroSection && heroFrame) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect   = heroSection.getBoundingClientRect();
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const dx     = (e.clientX - rect.left - cx) / cx;  // -1 to +1
            const dy     = (e.clientY - rect.top  - cy) / cy;

            // Subtle portrait frame shift
            heroFrame.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;

            // Background glows counter-move for depth illusion
            if (heroBgGlow)  heroBgGlow.style.transform  = `translate(${-dx * 20}px, ${-dy * 15}px) scale(1)`;
            if (heroBgGlow2) heroBgGlow2.style.transform = `translate(${dx * 15}px, ${dy * 10}px) scale(1)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroFrame.style.transform = 'translate(0, 0)';
            if (heroBgGlow)  heroBgGlow.style.transform  = '';
            if (heroBgGlow2) heroBgGlow2.style.transform = '';
        });
    }

    // ─────────────────────────────────────────────
    // HERO FLOAT CARDS — tilt on hover
    // ─────────────────────────────────────────────
    const floatCards = document.querySelectorAll('.hero-float-card');
    floatCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ─────────────────────────────────────────────
    // FEATURED BANNER — subtle image parallax on hover
    // ─────────────────────────────────────────────
    const featuredBanner = document.querySelector('.featured-project-banner');
    const featuredImg    = featuredBanner?.querySelector('.featured-img');
    if (featuredBanner && featuredImg) {
        featuredBanner.addEventListener('mousemove', (e) => {
            const rect = featuredBanner.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;
            featuredImg.style.transform = `scale(1.06) translate(${x * 12}px, ${y * 8}px)`;
        });
        featuredBanner.addEventListener('mouseleave', () => {
            featuredImg.style.transform = 'scale(1) translate(0, 0)';
        });
    }

    // ─────────────────────────────────────────────
    // AWARD ITEMS — stagger reveal on scroll
    // ─────────────────────────────────────────────
    const awardItems = document.querySelectorAll('.award-cin-item');
    if (awardItems.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity  = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 }).observe(document.getElementById('projects') || document.body);
    }

    // ─────────────────────────────────────────────
    // CINEMATIC GLITCH on logo (subtle, periodic)
    // ─────────────────────────────────────────────
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        setInterval(() => {
            if (Math.random() < 0.3) {
                logo.style.textShadow = `${Math.random() * 4 - 2}px 0 var(--primary), ${Math.random() * -4 + 2}px 0 var(--accent)`;
                setTimeout(() => { logo.style.textShadow = ''; }, 80);
            }
        }, 3000);
    });

});
