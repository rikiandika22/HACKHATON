import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // 1. Hero Text Appearance Animation (Replacing Car animation)
    const titleLines = document.querySelectorAll('.hero-title-line');
    const heroTexts = document.querySelectorAll('.hero-text-animate');

    if (titleLines.length) {
        gsap.fromTo(titleLines, {
            yPercent: 100
        }, {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.1
        });
    }

    if (heroTexts.length) {
        gsap.fromTo(heroTexts, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.5
        });
    }

    // 2. Infinite Marquee
    const marqueeContainer = document.querySelector('.animate-marquee');
    if (marqueeContainer) {
        marqueeContainer.style.animation = 'none';

        gsap.to(marqueeContainer, {
            xPercent: -50,
            ease: "none",
            duration: 25,
            repeat: -1
        });
    }

    // 3. Mouse Tracking Parallax for White Car Detail
    const carsPartSection = document.getElementById('cars-part');
    const carTarget = document.querySelector('.car-parallax-target');

    if (carsPartSection && carTarget) {
        carsPartSection.addEventListener('mousemove', (e) => {
            const rect = carsPartSection.getBoundingClientRect();
            // Calculate mouse position relative to center of the section
            const mouseX = (e.clientX - rect.left - rect.width / 2) * -0.04;
            const mouseY = (e.clientY - rect.top - rect.height / 2) * -0.04;

            gsap.to(carTarget, {
                x: mouseX,
                y: mouseY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        carsPartSection.addEventListener('mouseleave', () => {
            gsap.to(carTarget, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        });

        // Scroll animation for Cars Part Detail Section
        const sectionTitle = carsPartSection.querySelector('h2');
        const hotspots = carsPartSection.querySelectorAll('.group');

        gsap.fromTo(sectionTitle, {
            opacity: 0,
            x: 50
        }, {
            opacity: 0.9,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: carsPartSection,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.fromTo(carTarget, {
            opacity: 0,
            y: 100,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: carsPartSection,
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // We handle hotspots via CSS animation currently, but we can trigger their container fade-in
        gsap.utils.toArray(hotspots).forEach((hotspot, i) => {
            gsap.fromTo(hotspot, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.2 + 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: carsPartSection,
                    start: "top 50%",
                    toggleActions: "play none none reverse"
                }
            });
            // We remove the default CSS animation to prevent conflict
            hotspot.style.animation = 'none';
        });
    }
}
