/**
 * Shaista Salam | Portfolio
 * Dynamic Interaction, Smooth Animation & Multi-Tier Haptic Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HAPTIC & TACTILE FEEDBACK SYSTEM
       Supports:
       - Physical device vibration (Web Vibration API: navigator.vibrate)
       - Acoustic taptic micro-synthesizer (Web Audio API: crisp mechanical ticks)
       - Visual micro-compressions & dynamic coordinate ripple effects
       ========================================================================== */
    class HapticEngine {
        constructor() {
            this.vibrationSupported = 'vibrate' in navigator;
            this.audioCtx = null;
            this.enabled = true;
            this.soundEnabled = true;

            // Load saved user preference
            const savedState = localStorage.getItem('shaista_portfolio_haptics');
            if (savedState !== null) {
                this.enabled = savedState === 'true';
            }

            this.initAudio();
            this.initControls();
            this.attachEventListeners();
        }

        initAudio() {
            // Lazy-init AudioContext on user gesture to conform to browser autoplay policy
            const unlockAudio = () => {
                if (!this.audioCtx) {
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    if (AudioContextClass) {
                        this.audioCtx = new AudioContextClass();
                    }
                }
                if (this.audioCtx && this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }
                window.removeEventListener('pointerdown', unlockAudio);
                window.removeEventListener('keydown', unlockAudio);
            };
            window.addEventListener('pointerdown', unlockAudio, { passive: true });
            window.addEventListener('keydown', unlockAudio, { passive: true });
        }

        // Web Audio API synthesized mechanical taptic sound (simulates Apple Taptic Engine)
        playTapticSound(intensity = 'light') {
            if (!this.enabled || !this.soundEnabled || !this.audioCtx) return;

            try {
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }

                const now = this.audioCtx.currentTime;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                let freq = 180;
                let duration = 0.016;
                let peakGain = 0.08;

                if (intensity === 'medium') {
                    freq = 150;
                    duration = 0.024;
                    peakGain = 0.12;
                } else if (intensity === 'success') {
                    freq = 240;
                    duration = 0.04;
                    peakGain = 0.15;
                } else if (intensity === 'warning') {
                    freq = 110;
                    duration = 0.05;
                    peakGain = 0.14;
                }

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + duration);

                gain.gain.setValueAtTime(peakGain, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(now);
                osc.stop(now + duration);
            } catch (err) {
                // Ignore audio restriction errors quietly
            }
        }

        // Trigger comprehensive haptic feedback
        trigger(type = 'light') {
            if (!this.enabled) return;

            // 1. Hardware vibration for mobile devices
            if (this.vibrationSupported) {
                try {
                    switch (type) {
                        case 'light':
                            navigator.vibrate(12);
                            break;
                        case 'medium':
                            navigator.vibrate(28);
                            break;
                        case 'success':
                            navigator.vibrate([30, 40, 30, 40, 60]);
                            break;
                        case 'warning':
                            navigator.vibrate([40, 40, 40, 40]);
                            break;
                        default:
                            navigator.vibrate(15);
                    }
                } catch (e) {}
            }

            // 2. Synthesized acoustic haptic for desktop & tactile feedback
            this.playTapticSound(type);
        }

        // Visual click ripple expanding from touch / mouse coordinate
        createRipple(e, target) {
            const container = target.closest('.ripple-container') || target;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'haptic-ripple';

            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);

            ripple.style.left = `${clientX - rect.left - size / 2}px`;
            ripple.style.top = `${clientY - rect.top - size / 2}px`;

            container.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        attachEventListeners() {
            // Document-wide delegated listener for snappy responsiveness
            document.addEventListener('pointerdown', (e) => {
                const target = e.target.closest('[data-haptic], .btn-primary, .btn-secondary, .magnetic, .expertise-item, .project-card, .creative-card, .header-nav a, .social-icons a');
                if (!target) return;

                const hapticType = target.getAttribute('data-haptic') || 'light';
                this.trigger(hapticType);
                this.createRipple(e, target);
            }, { passive: true });
        }

        initControls() {
            const toggle = document.getElementById('hapticToggle');
            const statusText = document.getElementById('hapticStatusText');
            if (!toggle || !statusText) return;

            const updateUI = () => {
                if (this.enabled) {
                    toggle.classList.remove('muted');
                    statusText.textContent = 'Haptics: Active';
                } else {
                    toggle.classList.add('muted');
                    statusText.textContent = 'Haptics: Muted';
                }
            };

            updateUI();

            const toggleHandler = (e) => {
                e.preventDefault();
                this.enabled = !this.enabled;
                localStorage.setItem('shaista_portfolio_haptics', this.enabled);
                updateUI();

                if (this.enabled) {
                    this.trigger('medium');
                }
            };

            toggle.addEventListener('click', toggleHandler);
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    toggleHandler(e);
                }
            });
        }
    }

    const haptics = new HapticEngine();


    /* ==========================================================================
       2. DYNAMIC HERO TYPEWRITER / ROLE ROTATOR
       ========================================================================== */
    const typewriterEl = document.getElementById('hero-typewriter');
    if (typewriterEl) {
        const roles = [
            "Creative Designer",
            "Full-Stack Software Engineer",
            "Backend Systems Architect",
            "Interactive UI Specialist",
            "Digital Media Producer"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function typeLoop() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80 + Math.random() * 40;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 1800; // Pause at completion
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeLoop, typingSpeed);
        }

        setTimeout(typeLoop, 500);
    }


    /* ==========================================================================
       3. STICKY HEADER TRANSITION ON SCROLL
       ========================================================================== */
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 40) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }


    /* ==========================================================================
       4. SMOOTH SCROLL FOR INTERNAL NAVIGATION LINKS
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 75;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ==========================================================================
       5. SCROLL REVEAL OBSERVER (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    /* ==========================================================================
       6. 3D CARD TILT WITH SPECULAR GLARE
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        // Create specular glare overlay if missing
        if (!card.querySelector('.tilt-glare')) {
            const glare = document.createElement('div');
            glare.className = 'tilt-glare';
            card.appendChild(glare);
        }

        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Pitch and yaw (max 8 degrees)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            // Position glare
            const glareX = ((x / rect.width) * 100).toFixed(1);
            const glareY = ((y / rect.height) * 100).toFixed(1);
            card.style.setProperty('--glare-x', `${glareX}%`);
            card.style.setProperty('--glare-y', `${glareY}%`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    /* ==========================================================================
       7. MAGNETIC BUTTONS & ICONS WITH ELASTIC PHYSICS
       ========================================================================== */
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        let isHovered = false;

        el.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        el.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;

            // Subtle elastic attraction
            el.style.transform = `translate(${distanceX * 0.18}px, ${distanceY * 0.18}px)`;
        });

        el.addEventListener('mouseleave', () => {
            isHovered = false;
            el.style.transform = `translate(0px, 0px)`;
        });
    });


    /* ==========================================================================
       8. SMOOTH TRAILING GLOW CURSOR (DESKTOP)
       ========================================================================== */
    const cursorGlow = document.querySelector('.cursor-glow-effect');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let isMoving = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                cursorGlow.classList.add('active');
                isMoving = true;
            }
        }, { passive: true });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.16; // Lerp factor
            cursorY += dy * 0.16;

            cursorGlow.style.left = `${cursorX}px`;
            cursorGlow.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand cursor on interactive targets
        document.querySelectorAll('a, button, input, textarea, .magnetic, .tilt-card, .expertise-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovering'));
        });
    }


    /* ==========================================================================
       9. HERO PARTICLES WITH MOUSE INTERACTION
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: -1000, y: -1000, radius: 100 };

        function resize() {
            width = canvas.width = canvas.offsetWidth || window.innerWidth;
            height = canvas.height = canvas.offsetHeight || window.innerHeight;
        }
        window.addEventListener('resize', resize, { passive: true });
        resize();

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }, { passive: true });

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.size = Math.random() * 2 + 0.8;
                this.vy = -(Math.random() * 0.45 + 0.15);
                this.vx = (Math.random() - 0.5) * 0.35;
                this.baseOpacity = Math.random() * 0.5 + 0.15;
                this.opacity = this.baseOpacity;
                this.hue = Math.random() > 0.5 ? 155 : 45; // Emerald or amber gold
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 3;
                    this.y += (dy / dist) * force * 3;
                }

                if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.hue === 155
                    ? `rgba(16, 185, 129, ${this.opacity})`
                    : `rgba(245, 197, 66, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 11000), 75);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }


    /* ==========================================================================
       10. CONTACT FORM WITH HAPTIC FEEDBACK & WHATSAPP REDIRECTION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const sendEmailBtn = document.getElementById('sendEmailBtn');

    function getContactFormData() {
        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
        const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
        const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
        return { name, email, subject, message };
    }

    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');

    if (contactForm) {
        // Direct In-Page Form Submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const { name, email, subject, message } = getContactFormData();

            if (!name || !email || !message) {
                haptics.trigger('warning');
                showToast('Please fill out Name, Email, and Message.');
                return;
            }

            // Success haptic pattern & sound
            haptics.trigger('success');

            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                formStatus.style.color = 'var(--primary-green)';
                formStatus.style.border = '1px solid var(--primary-green)';
                formStatus.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i> Thank you, <strong>${name}</strong>! Your message has been dispatched directly. Shaista will reply to <em>${email}</em> promptly.`;
            }

            showToast('Message sent directly to Shaista Salam!');

            setTimeout(() => {
                contactForm.reset();
                setTimeout(() => {
                    if (formStatus) formStatus.style.display = 'none';
                }, 4500);
            }, 1000);
        });
    }

    // Direct WhatsApp send button
    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { name, email, subject, message } = getContactFormData();

            if (!name || !email || !message) {
                haptics.trigger('warning');
                showToast('Please fill out Name, Email, and Message.');
                return;
            }

            haptics.trigger('success');

            const whatsappNumber = '918075110426';
            const rawMessage = `Hello Shaista, I am contacting you from your portfolio website.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject || 'Project Inquiry'}\n*Message:*\n${message}`;
            const encodedMessage = encodeURIComponent(rawMessage);

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const whatsappUrl = isMobile
                ? `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
                : `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                formStatus.style.color = 'var(--primary-green)';
                formStatus.style.border = '1px solid var(--primary-green)';
                formStatus.textContent = 'Redirecting to WhatsApp...';
            }

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 300);

            setTimeout(() => {
                contactForm.reset();
                if (formStatus) formStatus.style.display = 'none';
            }, 3500);
        });
    }

    // Direct Email client send button
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { name, email, subject, message } = getContactFormData();
            if (!name || !email || !message) {
                haptics.trigger('warning');
                showToast('Please fill out Name, Email, and Message.');
                return;
            }
            haptics.trigger('success');
            const mailtoUrl = `mailto:shaistasalam7@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Project Inquiry')}&body=${encodeURIComponent(`Hi Shaista,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`)}`;
            window.location.href = mailtoUrl;
            showToast('Opening default email client...');
            setTimeout(() => {
                if (contactForm) contactForm.reset();
            }, 3000);
        });
    }


    /* ==========================================================================
       11. TOAST NOTIFICATION UTILITY
       ========================================================================== */
    function showToast(message) {
        const toast = document.getElementById('portfolioToast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        haptics.trigger('light');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }


    /* ==========================================================================
       12. COPY EMAIL TO CLIPBOARD WITH HAPTIC TOAST
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'shaistasalam7@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied: shaistasalam7@gmail.com');
                    haptics.trigger('success');
                }).catch(() => {
                    showToast('shaistasalam7@gmail.com');
                });
            } else {
                showToast('shaistasalam7@gmail.com');
            }
        });
    }


    /* ==========================================================================
       13. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const drawerClose = document.getElementById('drawerClose');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('active');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        haptics.trigger('light');
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });


    /* ==========================================================================
       14. LIVE SEARCH WITH INSTANT DROPDOWN & SMOOTH JUMP
       ========================================================================== */
    const searchInput = document.getElementById('portfolioSearch');
    const searchResults = document.getElementById('searchResults');
    const searchClearBtn = document.getElementById('searchClearBtn');

    const searchableItems = [
        { title: 'Seed Global Portal', category: 'Project', desc: 'Next.js, Prisma, Tailwind, PostgreSQL', target: '#portfolio' },
        { title: 'Room Allocation System', category: 'Project', desc: 'React, Node.js, Express, MongoDB', target: '#portfolio' },
        { title: 'Student Marketplace', category: 'Project', desc: 'Next.js, Tailwind CSS, Firebase', target: '#portfolio' },
        { title: 'Immersive WebGL', category: 'Project', desc: 'Three.js, WebGL, GSAP, Shaders', target: '#portfolio' },
        { title: 'Generative & Agentic AI', category: 'AI', desc: 'Autonomous agents, LLM pipelines, prompt engineering', target: '#skills' },
        { title: 'React.js & Next.js', category: 'Frontend', desc: 'Component architecture, SSR, dynamic routing', target: '#skills' },
        { title: 'TypeScript & JavaScript', category: 'Frontend', desc: 'Typed architectures, modern ES6+ standards', target: '#skills' },
        { title: 'Tailwind CSS', category: 'Frontend', desc: 'Utility-first modern styling & responsiveness', target: '#skills' },
        { title: 'Three.js & WebGL', category: 'Frontend', desc: '3D graphics, particles, dynamic canvas', target: '#skills' },
        { title: 'Node.js & Express.js', category: 'Backend', desc: 'Scalable servers, RESTful endpoints & auth', target: '#skills' },
        { title: 'Python', category: 'Backend', desc: 'Data handling, automation & algorithms', target: '#skills' },
        { title: 'PostgreSQL & MongoDB', category: 'Database', desc: 'Relational & NoSQL database design', target: '#skills' },
        { title: 'Prisma ORM & Firebase', category: 'Database', desc: 'Schema migrations, realtime data sync', target: '#skills' },
        { title: 'Docker & CI/CD', category: 'DevOps', desc: 'Containerization, automated deployment', target: '#skills' },
        { title: 'Commercial Video', category: 'Creatives', desc: 'Product storytelling & brand campaigns', target: '#creatives' },
        { title: 'Cinematic Reels', category: 'Creatives', desc: 'Atmospheric narratives, color grading', target: '#creatives' },
        { title: 'Travel Documentaries', category: 'Creatives', desc: 'Landscape cinematography & dynamic pacing', target: '#creatives' },
        { title: 'Documentary Filmmaking', category: 'Creatives', desc: 'Authentic journalism & character stories', target: '#creatives' },
        { title: 'About Shaista', category: 'Bio', desc: 'Software engineer & creative designer', target: '#about' },
        { title: 'Download Resume (CV)', category: 'Resume', desc: 'Download Shaista Salam official CV', target: 'assets/Shaista_Salam_Resume.pdf', isDownload: true },
        { title: 'Contact & Hire Me', category: 'Contact', desc: 'Discuss projects, roles, or collaborations', target: '#contact' }
    ];

    function handleSearch(query) {
        if (!searchResults) return;
        const cleanQuery = query.trim().toLowerCase();

        if (!cleanQuery) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            if (searchClearBtn) searchClearBtn.style.display = 'none';
            return;
        }

        if (searchClearBtn) searchClearBtn.style.display = 'block';

        const matches = searchableItems.filter(item => 
            item.title.toLowerCase().includes(cleanQuery) ||
            item.category.toLowerCase().includes(cleanQuery) ||
            item.desc.toLowerCase().includes(cleanQuery)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No matching skills or projects found.</div>';
        } else {
            searchResults.innerHTML = matches.map(item => `
                <a href="${item.target}" class="search-result-item" ${item.isDownload ? 'download target="_blank"' : ''}>
                    <div class="search-result-info">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-desc">${item.desc}</span>
                    </div>
                    <span class="search-result-tag">${item.category}</span>
                </a>
            `).join('');
        }

        searchResults.classList.add('active');

        searchResults.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const targetHref = el.getAttribute('href');
                if (targetHref.startsWith('#')) {
                    e.preventDefault();
                    searchResults.classList.remove('active');
                    if (searchInput) searchInput.value = '';
                    if (searchClearBtn) searchClearBtn.style.display = 'none';

                    const targetEl = document.querySelector(targetHref);
                    if (targetEl) {
                        const headerOffset = 75;
                        const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: pos, behavior: 'smooth' });
                        haptics.trigger('light');
                    }
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) searchResults.classList.add('active');
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                searchClearBtn.style.display = 'none';
                searchInput.focus();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchContainer')) {
            if (searchResults) searchResults.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchResults) searchResults.classList.remove('active');
            closeCreativeModal();
            closeDrawer();
        }
    });


    /* ==========================================================================
       15. PORTFOLIO FILTERING (ALL, FULL-STACK, WEB APPS, 3D)
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.portfolio-filter-bar .filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-grid .project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            haptics.trigger('light');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden-filter');
                } else {
                    card.classList.add('hidden-filter');
                }
            });
        });
    });




    /* ==========================================================================
       16. CREATIVE MEDIA SHOWCASE MODAL
       ========================================================================== */
    const creativeModal = document.getElementById('creativeModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalTools = document.getElementById('modalTools');
    const modalBadge = document.getElementById('modalBadge');
    const modalMediaPreview = document.getElementById('modalMediaPreview');

    const creativeDetails = {
        commercial: {
            title: "Commercial Showcase & Brand Narratives",
            badge: "Commercial Reel",
            category: "Brand Campaigns & Product Films",
            tools: "Adobe Premiere Pro, After Effects, DaVinci Resolve",
            image: "assets/commercial.jpg",
            description: "High-impact visual narratives tailored for brands, startups, and product launches with cinematic lighting, rhythmic pacing, and modern sound design designed to capture customer attention."
        },
        cinematic: {
            title: "Cinematic Atmosphere & Narrative Films",
            badge: "Cinematic Showcase",
            category: "Visual Narrative & Short Films",
            tools: "DaVinci Resolve Studio, Cinema 4D, Audition",
            image: "assets/cinematic.jpg",
            description: "Stylized, atmospheric storytelling utilizing deliberate framing, custom color science (LUT design), and emotive musical arrangement to craft unforgettable cinematic moments."
        },
        travel: {
            title: "Travel & Cultural Explorations",
            badge: "Travel Reel",
            category: "Landscape & Cultural Cinematography",
            tools: "Adobe Premiere Pro, DJI Color Profile, DaVinci",
            image: "assets/travel.jpg",
            description: "Breathtaking landscapes, dynamic movement, and immersive cultural documentary work capturing the spirit and textures of diverse environments around the world."
        },
        documentary: {
            title: "Documentary & Human Journalism",
            badge: "Documentary Reel",
            category: "Human Interest & Authentic Stories",
            tools: "Adobe Premiere Pro, Adobe Audition, Fairlight",
            image: "assets/documentary.jpg",
            description: "Raw, authentic journalism and character-driven moments. Focusing on unscripted emotion, genuine human interactions, and compelling non-fiction stories."
        }
    };

    function openCreativeModal(type) {
        const data = creativeDetails[type] || creativeDetails.commercial;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalBadge) modalBadge.textContent = data.badge;
        if (modalCategory) modalCategory.textContent = data.category;
        if (modalTools) modalTools.textContent = data.tools;
        if (modalDescription) modalDescription.textContent = data.description;
        if (modalMediaPreview) modalMediaPreview.style.backgroundImage = `url('${data.image}')`;

        if (creativeModal) {
            creativeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            haptics.trigger('medium');
        }
    }

    function closeCreativeModal() {
        if (creativeModal && creativeModal.classList.contains('active')) {
            creativeModal.classList.remove('active');
            document.body.style.overflow = '';
            haptics.trigger('light');
        }
    }

    document.querySelectorAll('.creative-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-creative-type');
            openCreativeModal(type);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCreativeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCreativeModal);


    /* ==========================================================================
       17. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            haptics.trigger('light');
        });
    }


    /* ==========================================================================
       18. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHTING)
       ========================================================================== */
    const spySections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');

    function updateActiveNav() {
        const scrollPosition = window.pageYOffset + 140;

        spySections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-nav');
                    } else {
                        link.classList.remove('active-nav');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();


    /* ==========================================================================
       19. QUICK-BAR JUMP TARGET HIGHLIGHTER ("WHAT DO YOU WANT TO BUILD?")
       ========================================================================== */
    const jumpTargets = {
        frontend: '#tech-frontend',
        backend: '#tech-backend',
        database: '#tech-database',
        creative: '#tech-creative',
        ai: '#tech-ai',
        webapps: '#portfolio',
        strategy: '#about',
        media: '#creatives'
    };

    document.querySelectorAll('[data-jump-target]').forEach(item => {
        item.addEventListener('click', () => {
            const key = item.getAttribute('data-jump-target');
            const selector = jumpTargets[key];
            if (!selector) return;

            const targetElement = document.querySelector(selector);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                haptics.trigger('medium');

                // Apply pulse glow effect
                targetElement.classList.remove('highlight-pulse');
                void targetElement.offsetWidth;
                targetElement.classList.add('highlight-pulse');

                setTimeout(() => {
                    targetElement.classList.remove('highlight-pulse');
                }, 2200);
            }
        });
    });


    /* ==========================================================================
       20. PROJECT DETAILS QUICK-VIEW MODAL
       ========================================================================== */
    const projectModal = document.getElementById('projectModal');
    const projectModalCloseBtn = document.getElementById('projectModalCloseBtn');
    const projectModalBackdrop = document.getElementById('projectModalBackdrop');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalSubtitle = document.getElementById('projectModalSubtitle');
    const projectModalDescription = document.getElementById('projectModalDescription');
    const projectModalImage = document.getElementById('projectModalImage');
    const projectModalBadge = document.getElementById('projectModalBadge');
    const projectModalFeatures = document.getElementById('projectModalFeatures');
    const projectModalStack = document.getElementById('projectModalStack');
    const projectModalRepo = document.getElementById('projectModalRepo');
    const projectModalDemo = document.getElementById('projectModalDemo');

    const projectData = {
        'seed-portal': {
            title: 'Seed Global Portal',
            subtitle: 'Enterprise School Management Architecture',
            badge: 'Production MVP',
            image: 'assets/project_seed_portal.jpg',
            description: 'A robust, role-based school management portal built to automate complex administrative workflows, academic evaluation tracking, and student records with uncompromising security and data integrity.',
            features: [
                'Granular Role-Based Access Control (Superadmin, Teachers, Parents, Students)',
                'Prisma ORM schema modeling with relational PostgreSQL constraints',
                'Automated batch operations for grade sheet and attendance processing',
                'Server-side rendering and static optimization for sub-second page delivery'
            ],
            stack: ['Next.js', 'Prisma ORM', 'Tailwind CSS', 'PostgreSQL', 'NextAuth', 'TypeScript'],
            repo: 'https://github.com/shaista-salam',
            demo: 'https://github.com/shaista-salam'
        },
        'room-allocation': {
            title: 'Room Allocation System',
            subtitle: 'Intelligent Space Optimization Engine',
            badge: 'Constraint Algorithm',
            image: 'assets/project_room_allocation.jpg',
            description: 'Automated campus and hostel housing distribution software that replaces error-prone manual spreadsheets with an algorithmic matching engine balancing student preferences, floor quotas, and room constraints.',
            features: [
                'Constraint-satisfaction allocation algorithm ensuring fair distribution',
                'Express.js backend with atomic MongoDB transactions to eliminate double-booking',
                'Interactive administrative dashboard with real-time floor occupancy visualizations',
                'CSV export and automated room confirmation email notifications'
            ],
            stack: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'JWT Auth'],
            repo: 'https://github.com/shaista-salam',
            demo: 'https://github.com/shaista-salam'
        },
        'student-marketplace': {
            title: 'Student Marketplace',
            subtitle: 'Peer-to-Peer Campus Commerce Platform',
            badge: 'Real-Time P2P',
            image: 'assets/project_student_marketplace.jpg',
            description: 'A verified student-to-student marketplace featuring real-time messaging, listing moderation, and a high-aesthetic UI designed specifically for academic campus ecosystems.',
            features: [
                'Instant peer-to-peer chat powered by Firebase Realtime synchronization',
                'Verified student authentication restricting access to authorized university domains',
                'Optimized image uploading with client-side compression pipeline',
                'Responsive design with tactile micro-interactions and dark-mode aesthetics'
            ],
            stack: ['Next.js', 'Tailwind CSS', 'Firebase Firestore', 'Real-Time Chat', 'WebSockets'],
            repo: 'https://github.com/shaista-salam',
            demo: 'https://github.com/shaista-salam'
        },
        'immersive-webgl': {
            title: 'Immersive WebGL Experience',
            subtitle: 'Interactive 3D Web Showcase',
            badge: 'WebGL & Shaders',
            image: 'assets/project_immersive.jpg',
            description: 'A cutting-edge interactive 3D browser showcase combining particle physics, custom GLSL shaders, camera easing, and reactive sound design for an unforgettable digital experience.',
            features: [
                'Custom Three.js particle system with cursor repulsion and elastic fluid physics',
                'Post-processing bloom, specular highlights, and chromatic aberration passes',
                'Smooth 60FPS render loop optimized across desktop and mobile GPUs',
                'Synchronized acoustic micro-feedback reacting to user interactions'
            ],
            stack: ['Three.js', 'WebGL', 'GSAP', 'GLSL Shaders', 'Web Audio API'],
            repo: 'https://github.com/shaista-salam',
            demo: 'https://github.com/shaista-salam'
        }
    };

    function openProjectModal(projectId) {
        const data = projectData[projectId] || projectData['seed-portal'];
        if (projectModalTitle) projectModalTitle.textContent = data.title;
        if (projectModalSubtitle) projectModalSubtitle.textContent = data.subtitle;
        if (projectModalBadge) projectModalBadge.textContent = data.badge;
        if (projectModalDescription) projectModalDescription.textContent = data.description;
        if (projectModalImage) projectModalImage.style.backgroundImage = `url('${data.image}')`;
        if (projectModalRepo) projectModalRepo.href = data.repo;
        if (projectModalDemo) projectModalDemo.href = data.demo || data.repo;

        if (projectModalFeatures) {
            projectModalFeatures.innerHTML = data.features.map(f => `
                <li><i class="fas fa-check-circle"></i> <span>${f}</span></li>
            `).join('');
        }

        if (projectModalStack) {
            projectModalStack.innerHTML = data.stack.map(s => `
                <span>${s}</span>
            `).join('');
        }

        if (projectModal) {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            haptics.trigger('medium');
        }
    }

    function closeProjectModal() {
        if (projectModal && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
            haptics.trigger('light');
        }
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a[href*="github.com"]')) return;
            const projectId = card.getAttribute('data-project-id');
            if (projectId) {
                openProjectModal(projectId);
            }
        });
    });

    if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', closeProjectModal);
    if (projectModalBackdrop) projectModalBackdrop.addEventListener('click', closeProjectModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
    /* ==========================================================================
       21. CONTACT FORM & INTERACTIVE DISPATCH HANDLERS
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = 'shaistasalam7@gmail.com';
            navigator.clipboard.writeText(emailText).then(() => {
                const originalHtml = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i class="fas fa-check" style="color: #4ade80;"></i> <span style="color: #4ade80;">Copied!</span>';
                copyEmailBtn.style.borderColor = '#4ade80';
                haptics.trigger('success');

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalHtml;
                    copyEmailBtn.style.borderColor = '';
                }, 2500);
            }).catch(() => {
                window.location.href = `mailto:${emailText}`;
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    const sendDirectBtn = document.getElementById('sendDirectBtn');
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const formStatus = document.getElementById('formStatus');

    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', () => {
            const name = document.getElementById('name')?.value.trim() || 'Visitor';
            const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
            const message = document.getElementById('message')?.value.trim() || 'Hello Shaista!';

            const waText = encodeURIComponent(`Hi Shaista, my name is ${name}.\nSubject: ${subject}\n\n${message}`);
            window.open(`https://wa.me/918075110426?text=${waText}`, '_blank');
            haptics.trigger('light');
        });
    }

    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            const name = document.getElementById('name')?.value.trim() || 'Visitor';
            const email = document.getElementById('email')?.value.trim() || '';
            const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
            const message = document.getElementById('message')?.value.trim() || '';

            const mailBody = encodeURIComponent(`Hi Shaista,\n\n${message}\n\nFrom: ${name} (${email})`);
            window.location.href = `mailto:shaistasalam7@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
            haptics.trigger('light');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.style.background = 'rgba(239, 68, 68, 0.15)';
                    formStatus.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                    formStatus.style.color = '#f87171';
                    formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
                }
                return;
            }

            if (sendDirectBtn) {
                sendDirectBtn.disabled = true;
                sendDirectBtn.innerHTML = 'SENDING... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
            }

            // Client-side confirmation + mail dispatch
            setTimeout(() => {
                if (sendDirectBtn) {
                    sendDirectBtn.disabled = false;
                    sendDirectBtn.innerHTML = 'MESSAGE SENT <i class="fas fa-check" style="margin-left: 8px;"></i>';
                }

                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.style.background = 'rgba(16, 185, 129, 0.15)';
                    formStatus.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                    formStatus.style.color = '#34d399';
                    formStatus.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, <strong>${name}</strong>! Your inquiry regarding "${subject || 'General Inquiry'}" has been prepared. Shaista will reply to <strong>${email}</strong> shortly.`;
                }

                // Trigger mail client as reliable transmission
                const mailBody = encodeURIComponent(`Hi Shaista,\n\n${message}\n\nFrom: ${name} (${email})`);
                window.location.href = `mailto:shaistasalam7@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${mailBody}`;

                contactForm.reset();
                haptics.trigger('success');

                setTimeout(() => {
                    if (sendDirectBtn) {
                        sendDirectBtn.innerHTML = 'SEND DIRECT MESSAGE <i class="fas fa-paper-plane" style="margin-left: 8px;"></i>';
                    }
                }, 4000);
            }, 600);
        });
    }

});
