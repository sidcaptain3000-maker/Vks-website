document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger
        const bars = mobileBtn.querySelectorAll('.bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            // Reset hamburger
            const bars = mobileBtn.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Navbar Scroll Effect
    // Navbar Scroll Effect - Sticky Update
    const navbar = document.querySelector('.navbar');

    const updateNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavbar);
    // Initial check
    updateNavbar();

    // Smooth Scroll for Anchor Links (Polyfill-like behavior for older browsers if needed, but CSS scroll-behavior usually handles it)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lenis Smooth Scroll Init
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // Staggered Animations for Grids
    const grids = document.querySelectorAll('.services-grid, .portfolio-grid, .gallery-grid');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            // Cycle through delays 100-400ms
            const delay = (index % 4 + 1) * 100;
            item.style.transitionDelay = `${delay}ms`;
            item.classList.add('fade-in-up'); // Ensure they have the base animation class
        });
    });

    // Intersection Observer for Fade-in Animations on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .stat-card, .contact-wrapper, .gallery-item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'; // Tech-savvy easing
        observer.observe(el);
    });

    // Contact Form Submission Handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formStatus = contactForm.querySelector('.form-status');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(contactForm);

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Success
                    formStatus.textContent = '✓ Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
                    formStatus.style.backgroundColor = '#d4edda';
                    formStatus.style.color = '#155724';
                    formStatus.style.border = '1px solid #c3e6cb';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error
                formStatus.textContent = '✗ Oops! Something went wrong. Please try again or contact us directly via email/phone.';
                formStatus.style.backgroundColor = '#f8d7da';
                formStatus.style.color = '#721c24';
                formStatus.style.border = '1px solid #f5c6cb';
                formStatus.style.display = 'block';
            } finally {
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- New Dynamic Features (Stitch Suggestion) ---

    // 1. Stats Count Up Animation
    function initStatsCounter() {
        const stats = document.querySelectorAll('.stat-card h3');
        if (stats.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const fullText = target.innerText;
                    const hasPlus = fullText.includes('+');
                    const hasPercent = fullText.includes('%');
                    const endValue = parseInt(fullText.replace(/[^0-9]/g, ''));

                    let startTimestamp = null;
                    const duration = 2000; // 2 seconds

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                        // Easing function for smooth count
                        const easeOutQuad = 1 - (1 - progress) * (1 - progress);

                        const currentVal = Math.floor(easeOutQuad * endValue);

                        let suffix = '';
                        if (hasPlus) suffix = '+';
                        if (hasPercent) suffix = '%';

                        target.innerText = currentVal + suffix;

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            target.innerText = fullText; // Ensure exact final state
                        }
                    };

                    window.requestAnimationFrame(step);
                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }
    initStatsCounter();

    // 2. Magnetic Button Effect for Hero
    const magneticBtn = document.querySelector('.hero-btns .btn-primary');
    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull strength
            magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });

        magneticBtn.addEventListener('mouseleave', () => {
            // Reset position
            magneticBtn.style.transform = 'translate(0, 0) scale(1)';
            // Note: transition in CSS handles the smooth return
        });
    }


    // 3. Portfolio Parallax (Muted for performance, using background position)
    const portfolioImages = document.querySelectorAll('.portfolio-item .portfolio-img');
    if (portfolioImages.length > 0) {
        window.addEventListener('scroll', () => {
            portfolioImages.forEach((img, index) => {
                // Apply parallax only to every second item for variation
                if (index % 2 !== 0) {
                    const speed = 0.03;
                    const rect = img.parentElement.getBoundingClientRect();
                    // Check if in view
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const offset = (window.innerHeight - rect.top) * speed;
                        img.style.backgroundPosition = `center calc(50% + ${offset}px)`;
                    }
                }
            });
        });
    }
});
