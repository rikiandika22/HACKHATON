import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // 1. Hero Text Appearance Animation (Replacing Car animation)
    const titleLines = document.querySelectorAll('.hero-title-line');
    const heroTexts = document.querySelectorAll('.hero-text-animate');

    // Logo Tire Slide Left-Right Animation on Load
    const logoTire = document.querySelector('.brand-logo-anim');
    if (logoTire) {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo(logoTire, { x: -30, opacity: 0 }, { x: 15, opacity: 1, duration: 0.6, ease: "power2.out" })
            .to(logoTire, { x: -10, duration: 0.3, ease: "power1.inOut" })
            .to(logoTire, { x: 0, duration: 0.4, ease: "power2.out" });
    }

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

    // 2. Feature Intro Section (Asisten Otomotif Cerdas) Scroll Animation
    const featureIntroSection = document.getElementById('feature-intro');
    if (featureIntroSection) {
        const tlFeature = gsap.timeline({
            scrollTrigger: {
                trigger: featureIntroSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        tlFeature.to('.feature-title-anim', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
            .to('.feature-bubble-1-anim', { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .to('.feature-bubble-2-anim', { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .to('.feature-image-anim', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }, '-=0.6');
    }

    // 3. Infinite Marquee
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
        const sectionTitle = carsPartSection.querySelector('.cars-part-title-anim');
        const svgLines = carsPartSection.querySelectorAll('.draw-line-anim');
        const textBlocks = carsPartSection.querySelectorAll('.hotspot-text-anim');

        // Animate Title
        if (sectionTitle) {
            gsap.fromTo(sectionTitle, {
                opacity: 0,
                y: -30
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: carsPartSection,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // Animate Car
        gsap.fromTo(carTarget, {
            opacity: 0,
            y: 80,
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

        // Initialize SVG lines (draw effect)
        gsap.utils.toArray(svgLines).forEach((line, i) => {
            const length = line.getTotalLength();
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

            gsap.to(line, {
                strokeDashoffset: 0,
                duration: 1,
                delay: 0.5 + (i * 0.1),
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: carsPartSection,
                    start: "top 50%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Animate Text Blocks
        gsap.utils.toArray(textBlocks).forEach((block, i) => {
            gsap.fromTo(block, {
                opacity: 0,
                y: 15
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 1.2 + (i * 0.1), // Starts after lines are mostly drawn
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: carsPartSection,
                    start: "top 50%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}
