/**
 * Animations Module - Handles CSS animations and transitions
 */

/**
 * Animate element entrance
 * @param {string} selector - CSS selector
 * @param {string} animation - Animation class name
 * @param {number} delay - Delay in ms
 */
export function animateEntrance(selector, animation = 'animate-fade-in', delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add(animation);
        }, delay + (index * 50));
    });
}

/**
 * Add staggered animation to elements
 * @param {string} selector - CSS selector
 * @param {string} animation - Animation class name
 * @param {number} staggerDelay - Delay between each element in ms
 */
export function staggerAnimation(selector, animation = 'animate-fade-in', staggerDelay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * staggerDelay}ms`;
        el.classList.add(animation);
    });
}

/**
 * Animate scroll to element
 * @param {string} selector - CSS selector
 * @param {number} duration - Duration in ms
 */
export function scrollToElement(selector, duration = 300) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Pulse animation
 * @param {string} selector - CSS selector
 * @param {number} duration - Duration in ms (one cycle)
 */
export function pulseAnimation(selector, duration = 1000) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.add('animate-pulse');
    element.style.animationDuration = `${duration}ms`;
}

/**
 * Remove animation class
 * @param {string} selector - CSS selector
 * @param {string} animation - Animation class name
 */
export function removeAnimation(selector, animation) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.remove(animation);
    });
}

/**
 * Create ripple effect on click
 * @param {HTMLElement} element - Element to add ripple to
 */
export function addRippleEffect(element) {
    element.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
}

/**
 * Add CSS for ripple effect (should be added to stylesheet)
 */
export const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(232, 160, 32, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

/**
 * Parallax scroll effect
 * @param {string} selector - CSS selector for parallax element
 * @param {number} strength - Parallax strength (0.5 = half speed)
 */
export function enableParallax(selector, strength = 0.5) {
    const elements = document.querySelectorAll(selector);
    
    window.addEventListener('scroll', () => {
        elements.forEach(el => {
            const scrollPos = window.scrollY;
            el.style.transform = `translateY(${scrollPos * strength}px)`;
        });
    });
}

/**
 * Hover scale effect
 * @param {string} selector - CSS selector
 * @param {number} scale - Scale factor (1.1 = 10% larger)
 */
export function addHoverScale(selector, scale = 1.05) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = `scale(${scale})`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
        });
    });
}

/**
 * Count up animation for numbers
 * @param {HTMLElement} element - Element containing number
 * @param {number} finalNumber - Final number to count to
 * @param {number} duration - Duration in ms
 */
export function countUp(element, finalNumber, duration = 2000) {
    const startNumber = parseInt(element.textContent) || 0;
    const increment = finalNumber / (duration / 16);
    let current = startNumber;

    const counter = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
            element.textContent = finalNumber;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Fade in elements on scroll
 * @param {string} selector - CSS selector
 */
export function fadeInOnScroll(selector) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/**
 * Slide in elements on scroll
 * @param {string} selector - CSS selector
 * @param {string} direction - 'left' or 'right'
 */
export function slideInOnScroll(selector, direction = 'left') {
    const animation = direction === 'left' ? 'animate-slide-left' : 'animate-slide-right';
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animation);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/**
 * Smooth transition between pages
 */
export function pageTransitionIn() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    }, 0);
}

export function pageTransitionOut() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0';
}

/**
 * Add transition to element
 * @param {string} selector - CSS selector
 * @param {string} properties - CSS properties to transition
 * @param {number} duration - Duration in ms
 */
export function addTransition(selector, properties = 'all', duration = 300) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.style.transition = `${properties} ${duration}ms ease`;
    });
}

/**
 * Remove transition from element
 * @param {string} selector - CSS selector
 */
export function removeTransition(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.style.transition = 'none';
    });
}

/**
 * Shake animation
 * @param {string} selector - CSS selector
 */
export function shakeElement(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    const keyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

/**
 * Bounce animation
 * @param {string} selector - CSS selector
 */
export function bounceElement(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    const keyframes = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = 'bounce 0.6s ease-in-out';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

/**
 * Rotate animation
 * @param {string} selector - CSS selector
 * @param {number} degrees - Degrees to rotate
 * @param {number} duration - Duration in ms
 */
export function rotateElement(selector, degrees = 360, duration = 1000) {
    const element = document.querySelector(selector);
    if (!element) return;

    const keyframes = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(${degrees}deg); }
        }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = `rotate ${duration}ms linear`;
}
