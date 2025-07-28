// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initEnhancedPhotoCircle();
    initNavigation();
    initAnimations();
    initContactForm();
    initMobileMenu();
});

// Enhanced Cursor-Responsive Particle Background System
function initParticleBackground() {
    const particleContainer = document.getElementById('particles-background');
    if (!particleContainer) return;
    
    const particles = [];
    const particleCount = 80; // Base particles for background
    
    // Particle colors
    const colors = ['#779ECB', '#B3CDE0', '#966FD6'];
    
    // Mouse/touch position tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isInteracting = false;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isInteracting = true;
        
        // Reset interaction flag after a delay
        clearTimeout(window.interactionTimeout);
        window.interactionTimeout = setTimeout(() => {
            isInteracting = false;
        }, 150);
    });

    // Track touch movement for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            isInteracting = true;
            
            clearTimeout(window.interactionTimeout);
            window.interactionTimeout = setTimeout(() => {
                isInteracting = false;
            }, 150);
        }
    }, { passive: true });

    // Touch start/end events
    document.addEventListener('touchstart', (e) => {
        isInteracting = true;
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchend', () => {
        setTimeout(() => {
            isInteracting = false;
        }, 100);
    });
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 4-10px
        const size = Math.random() * 6 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // Enhanced glow effect
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}80, 0 0 ${size * 6}px ${color}40`;
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // Enhanced opacity
        particle.style.opacity = Math.random() * 0.6 + 0.4;
        
        // Style properties
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        particleContainer.appendChild(particle);
        
        // Store initial position and properties
        particle.baseX = startX;
        particle.baseY = startY;
        particle.currentX = startX;
        particle.currentY = startY;
        particle.targetX = startX;
        particle.targetY = startY;
        particle.size = size;
        particle.color = color;
        particle.baseOpacity = parseFloat(particle.style.opacity);
        
        // Base floating animation with GSAP
        const duration = Math.random() * 20 + 15;
        const xMovement = (Math.random() - 0.5) * 200;
        const yMovement = (Math.random() - 0.5) * 200;
        
        gsap.to(particle, {
            duration: duration,
            x: xMovement,
            y: yMovement,
            rotation: Math.random() * 360,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        return particle;
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
    
    // Cursor interaction system
    function updateParticleInteraction() {
        particles.forEach(particle => {
            if (!particle || !particle.getBoundingClientRect) return;
            
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            // Calculate distance from cursor
            const dx = mouseX - particleX;
            const dy = mouseY - particleY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Interaction radius
            const maxDistance = 150;
            
            if (distance < maxDistance && isInteracting) {
                // Calculate interaction strength
                const strength = (maxDistance - distance) / maxDistance;
                
                // Move particles away from cursor
                const repulsionForce = 40 * strength;
                const angle = Math.atan2(dy, dx);
                
                particle.targetX = particle.currentX - Math.cos(angle) * repulsionForce;
                particle.targetY = particle.currentY - Math.sin(angle) * repulsionForce;
                
                // Enhanced glow when interacting
                const enhancedOpacity = Math.min(particle.baseOpacity + strength * 0.4, 1);
                const glowSize = particle.size * (2 + strength * 2);
                
                gsap.to(particle, {
                    duration: 0.3,
                    x: particle.targetX - particle.baseX,
                    y: particle.targetY - particle.baseY,
                    opacity: enhancedOpacity,
                    scale: 1 + strength * 0.3,
                    ease: "power2.out"
                });
                
                // Update glow effect
                particle.style.boxShadow = `0 0 ${glowSize}px ${particle.color}90, 0 0 ${glowSize * 2}px ${particle.color}60`;
                
            } else {
                // Return to base state
                gsap.to(particle, {
                    duration: 2,
                    opacity: particle.baseOpacity,
                    scale: 1,
                    ease: "power2.out"
                });
                
                // Reset glow
                particle.style.boxShadow = `0 0 ${particle.size * 3}px ${particle.color}80, 0 0 ${particle.size * 6}px ${particle.color}40`;
                
                // Update current position
                particle.currentX = particleX;
                particle.currentY = particleY;
            }
        });
        
        requestAnimationFrame(updateParticleInteraction);
    }
    
    // Start interaction system
    updateParticleInteraction();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        particles.forEach(particle => {
            if (!particle || !particle.getBoundingClientRect) return;
            
            const rect = particle.getBoundingClientRect();
            if (rect.left < -50 || rect.left > window.innerWidth + 50 || 
                rect.top < -50 || rect.top > window.innerHeight + 50) {
                particle.baseX = Math.random() * window.innerWidth;
                particle.baseY = Math.random() * window.innerHeight;
                particle.style.left = particle.baseX + 'px';
                particle.style.top = particle.baseY + 'px';
            }
        });
    });
}

// Enhanced Photo Circle with 45 Interactive Particles
function initEnhancedPhotoCircle() {
    const circleContainer = document.getElementById('circle-particles');
    if (!circleContainer) return;
    
    const circleParticles = [];
    const particleCount = 45; // 45 particles specifically for the circle
    const colors = ['#779ECB', '#B3CDE0', '#966FD6'];
    
    // Circle properties
    const centerX = 175; // Half of 350px
    const centerY = 175;
    const innerRadius = 120;
    const outerRadius = 200;
    
    // Mouse tracking for circle interactions
    let circleMouseX = 0;
    let circleMouseY = 0;
    let isHoveringCircle = false;
    
    function createCircleParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'circle-particle';
        
        // Random size between 3-8px
        const size = Math.random() * 5 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}90, 0 0 ${size * 4}px ${color}50`;
        
        // Random radius between inner and outer bounds
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const angle = (index / particleCount) * Math.PI * 2 + Math.random() * 0.5;
        
        // Calculate position
        const startX = centerX + Math.cos(angle) * radius;
        const startY = centerY + Math.sin(angle) * radius;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        
        circleContainer.appendChild(particle);
        
        // Store particle properties
        particle.baseX = startX;
        particle.baseY = startY;
        particle.currentX = startX;
        particle.currentY = startY;
        particle.baseRadius = radius;
        particle.baseAngle = angle;
        particle.size = size;
        particle.color = color;
        particle.baseOpacity = parseFloat(particle.style.opacity);
        particle.orbitSpeed = 0.002 + Math.random() * 0.003; // Different speeds
        particle.currentAngle = angle;
        
        // Orbital animation
        gsap.set(particle, {
            transformOrigin: `${centerX - startX}px ${centerY - startY}px`
        });
        
        return particle;
    }
    
    // Create circle particles
    for (let i = 0; i < particleCount; i++) {
        circleParticles.push(createCircleParticle(i));
    }
    
    // Mouse tracking for the photo circle area
    const photoCircle = document.getElementById('photo-circle');
    if (photoCircle) {
        photoCircle.addEventListener('mouseenter', () => {
            isHoveringCircle = true;
        });
        
        photoCircle.addEventListener('mouseleave', () => {
            isHoveringCircle = false;
        });
        
        photoCircle.addEventListener('mousemove', (e) => {
            const rect = photoCircle.getBoundingClientRect();
            circleMouseX = e.clientX - rect.left;
            circleMouseY = e.clientY - rect.top;
        });
    }
    
    // Continuous orbital motion and interaction system
    function updateCircleParticles() {
        circleParticles.forEach((particle, index) => {
            if (!particle) return;
            
            // Update orbital position
            particle.currentAngle += particle.orbitSpeed;
            
            // Calculate new orbital position
            const orbitalX = centerX + Math.cos(particle.currentAngle) * particle.baseRadius;
            const orbitalY = centerY + Math.sin(particle.currentAngle) * particle.baseRadius;
            
            let finalX = orbitalX;
            let finalY = orbitalY;
            let opacity = particle.baseOpacity;
            let scale = 1;
            let glowIntensity = 1;
            
            // Cursor interaction when hovering over circle
            if (isHoveringCircle) {
                const dx = circleMouseX - orbitalX;
                const dy = circleMouseY - orbitalY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxInteractionDistance = 80;
                
                if (distance < maxInteractionDistance) {
                    const strength = (maxInteractionDistance - distance) / maxInteractionDistance;
                    
                    // Repulsion effect
                    const repulsionForce = 30 * strength;
                    const angle = Math.atan2(dy, dx);
                    
                    finalX = orbitalX - Math.cos(angle) * repulsionForce;
                    finalY = orbitalY - Math.sin(angle) * repulsionForce;
                    
                    // Enhanced visual effects
                    opacity = Math.min(particle.baseOpacity + strength * 0.5, 1);
                    scale = 1 + strength * 0.5;
                    glowIntensity = 1 + strength * 2;
                }
            }
            
            // Apply transformations
            gsap.set(particle, {
                x: finalX - particle.baseX,
                y: finalY - particle.baseY,
                opacity: opacity,
                scale: scale
            });
            
            // Update glow effect
            const glowSize = particle.size * 2 * glowIntensity;
            particle.style.boxShadow = `0 0 ${glowSize}px ${particle.color}90, 0 0 ${glowSize * 2}px ${particle.color}50`;
            
            // Update current position for next frame
            particle.currentX = finalX;
            particle.currentY = finalY;
        });
        
        requestAnimationFrame(updateCircleParticles);
    }
    
    // Start the animation loop
    updateCircleParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        // Recalculate positions if needed
        const photoCircleElement = document.querySelector('.photo-circle');
        if (photoCircleElement) {
            const rect = photoCircleElement.getBoundingClientRect();
            // Update center coordinates if circle position changes
        }
    });
}

// Enhanced Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Enhanced scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.borderBottom = '1px solid rgba(119, 158, 203, 0.4)';
            navbar.style.boxShadow = '0 4px 20px rgba(119, 158, 203, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(119, 158, 203, 0.2)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Enhanced smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetOffset = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
                
                // Visual feedback
                gsap.to(link, {
                    duration: 0.3,
                    scale: 1.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                const bars = hamburger.querySelectorAll('.bar');
                gsap.to(bars[0], {duration: 0.3, rotation: 0, y: 0});
                gsap.to(bars[1], {duration: 0.3, opacity: 1});
                gsap.to(bars[2], {duration: 0.3, rotation: 0, y: 0});
            }
        });
    });

    // Enhanced active section highlighting
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    gsap.set(link, {scale: 1});
                });
                
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    gsap.fromTo(activeLink, 
                        {scale: 1}, 
                        {duration: 0.3, scale: 1.05, yoyo: true, repeat: 1, ease: "power2.inOut"}
                    );
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// GSAP Animations
function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping animations');
        return;
    }

    // Hero section animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .from('.hero-title', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: "power3.out"
        })
        .from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.6")
        .from('.hero-description', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.7")
        .from('.hero-cta .btn', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, "-=0.5")
        .from('.hero-social a', {
            duration: 0.6,
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.3")
        .from('.animated-circle-container', {
            duration: 1.5,
            scale: 0.8,
            opacity: 0,
            rotation: 45,
            ease: "back.out(1.2)"
        }, "-=1.2");

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 50,
            opacity: 0,
            scale: 0.9,
            ease: "power3.out"
        });
    });

    // Timeline items animations
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            ease: "power3.out",
            delay: index * 0.1
        });
    });

    // // Project cards animations
    // gsap.utils.toArray('.project-card').forEach((card, index) => {
    //     gsap.from(card, {
    //         scrollTrigger: {
    //             trigger: card,
    //             start: "top 85%",
    //             end: "bottom 15%",
    //             toggleActions: "play none none reverse"
    //         },
    //         duration: 0.8,
    //         y: 50,
    //         opacity: 0,
    //         scale: 0.9,
    //         rotation: index % 2 === 0 ? -5 : 5,
    //         ease: "power3.out",
    //         delay: index * 0.15
    //     });

    //     // Enhanced hover animation
    //     card.addEventListener('mouseenter', () => {
    //         gsap.to(card, {
    //             duration: 0.3,
    //             scale: 1.03,
    //             rotation: 0,
    //             ease: "power2.out"
    //         });
    //     });

    //     card.addEventListener('mouseleave', () => {
    //         gsap.to(card, {
    //             duration: 0.3,
    //             scale: 1,
    //             rotation: 0,
    //             ease: "power2.out"
    //         });
    //     });
    // });

    // updated above code such that last child fades inplace
    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, index) => {
    // Special handling for the last card
    if (index === projectCards.length - 1) {
        gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
        },
        duration: 0.8,
        y: 50,           // Slides up only
        x: 0,            // No slide from left/right
        opacity: 0,
        scale: 0.9,
        rotation: 0,     // No rotation
        ease: "power3.out",
        delay: index * 0.15
        });
    } else {
        gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
        },
        duration: 0.8,
        y: 50,
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
        scale: 0.9,
        rotation: index % 2 === 0 ? -5 : 5,
        ease: "power3.out",
        delay: index * 0.15
        });
    }
    });

    // Skills categories animations
    gsap.utils.toArray('.skill-category').forEach((category, index) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            scale: 0.95,
            ease: "power3.out",
            delay: index * 0.15
        });

        const skillIconItems = category.querySelectorAll('.skill-icon-item');
        if (skillIconItems.length > 0) {
            gsap.from(skillIconItems, {
                scrollTrigger: {
                    trigger: category,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.5,
                scale: 0,
                opacity: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
                delay: 0.3
            });
        }
    });

    // Achievement cards animations
    gsap.utils.toArray('.achievement-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            rotation: (index % 2 === 0 ? -3 : 3),
            ease: "power3.out",
            delay: index * 0.2
        });

        const icon = card.querySelector('.achievement-icon');
        if (icon) {
            gsap.from(icon, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.6,
                scale: 0,
                rotation: 360,
                ease: "back.out(1.7)",
                delay: (index * 0.2) + 0.3
            });
        }
    });

    // Publications and extracurricular items
    gsap.utils.toArray('.publication-item, .extracurricular-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            x: index % 2 === 0 ? -30 : 30,
            opacity: 0,
            ease: "power3.out",
            delay: index * 0.1
        });
    });

    // Contact section animations
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        duration: 1,
        x: -50,
        opacity: 0,
        ease: "power3.out"
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        duration: 1,
        x: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2
    });

    // Animate form fields
    gsap.utils.toArray('.form-group').forEach((group, index) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: '.contact-form',
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: "power3.out",
            delay: 0.5 + (index * 0.1)
        });
    });

    // Enhanced button hover animations
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1.05,
                y: -2,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1,
                y: 0,
                ease: "power2.out"
            });
        });
    });

    // Social icons hover animations
    document.querySelectorAll('.hero-social a, .contact-social a').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                duration: 0.4,
                rotation: 360,
                scale: 1.15,
                ease: "back.out(1.7)"
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                duration: 0.3,
                rotation: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            gsap.to(bars[0], {duration: 0.3, rotation: 45, y: 6});
            gsap.to(bars[1], {duration: 0.3, opacity: 0});
            gsap.to(bars[2], {duration: 0.3, rotation: -45, y: -6});
        } else {
            gsap.to(bars[0], {duration: 0.3, rotation: 0, y: 0});
            gsap.to(bars[1], {duration: 0.3, opacity: 1});
            gsap.to(bars[2], {duration: 0.3, rotation: 0, y: 0});
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            gsap.to(bars[0], {duration: 0.3, rotation: 0, y: 0});
            gsap.to(bars[1], {duration: 0.3, opacity: 1});
            gsap.to(bars[2], {duration: 0.3, rotation: 0, y: 0});
        }
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formInputs = form.querySelectorAll('input, textarea');

    // Add focus animations to form inputs
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                duration: 0.3,
                scale: 1.02,
                ease: "power2.out"
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const subject = formData.get('subject')?.trim() || '';
        const message = formData.get('message')?.trim() || '';

        // Clear previous error states
        clearFormErrors();

        // Validation flags
        let hasErrors = false;

        // Validate required fields
        if (!name) {
            showFieldError('name', 'Name is required');
            hasErrors = true;
        }

        if (!email) {
            showFieldError('email', 'Email is required');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (!subject) {
            showFieldError('subject', 'Subject is required');
            hasErrors = true;
        }

        if (!message) {
            showFieldError('message', 'Message is required');
            hasErrors = true;
        } else if (message.length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            hasErrors = true;
        }

        // If there are errors, show notification and return
        if (hasErrors) {
            showNotification('Please fix the errors above and try again', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        gsap.to(submitBtn, {
            duration: 0.3,
            scale: 0.95,
            ease: "power2.out"
        });

        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });

            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Animate form reset
            gsap.from(formInputs, {
                duration: 0.5,
                scale: 0.95,
                opacity: 0.5,
                stagger: 0.05,
                ease: "power2.out"
            });
            
        }, 2000);
    });
}

// Form validation utility functions
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    
    // Add error class to field
    field.classList.add('error');
    
    // Create or update error message
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    
    // Animate error message
    gsap.from(errorMsg, {
        duration: 0.3,
        y: -10,
        opacity: 0,
        ease: "power2.out"
    });
}

function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.form-group input.error, .form-group textarea.error');
    
    errorMessages.forEach(msg => msg.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '12px',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: '10000',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        opacity: '0',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    });

    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #779ECB, #B3CDE0)';
        notification.style.boxShadow = '0 8px 25px rgba(119, 158, 203, 0.3)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
        notification.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #779ECB, #966FD6)';
        notification.style.boxShadow = '0 8px 25px rgba(119, 158, 203, 0.3)';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    gsap.to(notification, {
        duration: 0.5,
        x: 0,
        opacity: 1,
        ease: "back.out(1.7)"
    });

    // Animate out and remove
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.5,
            x: '100%',
            opacity: 0,
            ease: "power3.in",
            onComplete: () => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }
        });
    }, 4000);
}

// Performance optimization
function optimizeForPerformance() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (reducedMotion.matches && typeof gsap !== 'undefined') {
        ScrollTrigger.batch('.fade-in, .slide-in-left, .slide-in-right, .scale-in', {
            onEnter: (elements) => {
                gsap.set(elements, {opacity: 1, x: 0, y: 0, scale: 1});
            }
        });
    }
}

// Initialize performance optimizations
optimizeForPerformance();
