import '../css/style.css'
import Alpine from 'alpinejs'
import { initAnimations } from './animations.js'

window.Alpine = Alpine;

// Initialize Alpine components
Alpine.data('navbar', () => ({
    mobileMenuOpen: false,
    toggleMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; },
    closeMenu() { this.mobileMenuOpen = false; }
}));

Alpine.data('parallaxGallery', () => ({
    activeTooltip: null,
    showTooltip(tooltipName) { this.activeTooltip = tooltipName; },
    hideTooltip() { this.activeTooltip = null; }
}));

Alpine.start();

// Initialize GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});
