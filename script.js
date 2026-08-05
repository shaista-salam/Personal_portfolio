document.addEventListener('DOMContentLoaded', () => {

    // 1. Typewriter Effect
    const textToType = "Shaista Salam";
    const typewriterElement = document.getElementById('typewriter');
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(i);
            i++;
            // Randomize typing speed slightly for realism
            setTimeout(typeWriter, Math.random() * 50 + 100);
        }
    }

    // Start typing after a short delay (matches CSS animations)
    setTimeout(typeWriter, 1200);


    // 2. Mobile Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.right = '40px';
                navLinks.style.background = '#1a1a1a';
                navLinks.style.padding = '20px';
                navLinks.style.border = '1px solid rgba(255,255,255,0.1)';
                navLinks.style.borderRadius = '4px';
                navLinks.style.zIndex = '100';
            }
        });
    }

    // 3. Navbar Scroll Effect
    const topNav = document.querySelector('.top-nav');
    if (topNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                topNav.classList.add('scrolled');
            } else {
                topNav.classList.remove('scrolled');
            }
        });
    }

    // 4. Scroll Reveal Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-scroll');
    hiddenElements.forEach(el => observer.observe(el));

    // 5. Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-links a, .btn-green').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // 6. Custom Glow Cursor
    const cursorGlow = document.querySelector('.cursor-glow-effect');
    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.15; // Smooth trailing factor
            cursorY += dy * 0.15;
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        animateCursor();

        // Add hovering state to interactive elements for cursor
        document.querySelectorAll('a, button, .project-image, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.classList.remove('hovering');
            });
        });
    }

    // 7. 3D Tilt Effect on Project Cards
    const tiltCards = document.querySelectorAll('.project-image');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max rotation of 10 degrees
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // 8. Magnetic Buttons & Icons
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            
            // Move element slightly towards the cursor
            el.style.transform = `translate(${distanceX * 0.2}px, ${distanceY * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });
    // 9. Carousel Logic
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.slide');
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');

    if (track && slides.length > 0) {
        let currentIndex = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // 10. Contact Form Submission (WhatsApp)
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    const formStatus = document.getElementById('formStatus');

    if (contactForm && submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            // Check if form is valid before doing anything
            if (!contactForm.checkValidity()) {
                // Let the browser handle the required fields tooltip natively
                return;
            }
            
            e.preventDefault();
            console.log("Button click triggered!");

            // Set the WhatsApp number
            const whatsappNumber = '918075110426'; 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Format the message safely
            const rawMessage = `Hello Shaista, I am contacting you from your portfolio website.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:*\n${message}`;
            const encodedMessage = encodeURIComponent(rawMessage);

            // Detect if the user is on a mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Create the link (Deep link for mobile, wa.me for desktop)
            const whatsappUrl = isMobile 
                ? `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
                : `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                
            console.log("Redirecting to: ", whatsappUrl);

            // Show brief success feedback
            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(0, 176, 116, 0.1)';
                formStatus.style.color = 'var(--accent-green)';
                formStatus.style.border = '1px solid var(--accent-green)';
                formStatus.textContent = 'Opening WhatsApp...';
            }

            // Force navigation
            window.location.href = whatsappUrl;
            
            // Try window.open as a fallback if href is somehow blocked
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 100);
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                if (formStatus) formStatus.style.display = 'none';
            }, 4000);
        });
    }

    // 11. Instagram Deep Linking
    document.querySelectorAll('.ig-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const username = 'shaistasalam7';
            
            // Detect mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Try to open Instagram app via deep link
                window.location.href = `instagram://user?username=${username}`;
                
                // Fallback to web if app is not installed
                setTimeout(() => {
                    window.open(`https://www.instagram.com/${username}/`, '_blank');
                }, 1500);
            } else {
                // On desktop/laptop, open standard web link
                window.open(`https://www.instagram.com/${username}/`, '_blank');
            }
        });
    });

});
