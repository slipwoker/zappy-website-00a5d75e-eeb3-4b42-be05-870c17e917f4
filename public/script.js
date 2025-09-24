// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMenuTabs();
    initializeForms();
    initializeScrollEffects();
    initializeAccessibility();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Menu tabs functionality
function initializeMenuTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.menu-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const targetTabElement = document.getElementById(targetTab);
            if (targetTabElement) {
                targetTabElement.classList.add('active');
            }
        });
    });
}

// Form handling
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

// Contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'שולח...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormSuccess();
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Clear any error states
            inputs.forEach(input => {
                input.classList.remove('error');
                const errorElement = document.getElementById(input.name + '-error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }, 1500);
    }
}

// Newsletter form submission
function handleNewsletterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    
    if (email.value && isValidEmail(email.value)) {
        const originalText = button.textContent;
        button.textContent = 'מירשם...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'הרשמה הושלמה!';
            button.style.backgroundColor = '#48bb78';
            email.value = '';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.backgroundColor = '';
            }, 2000);
        }, 1000);
    } else {
        email.style.borderColor = '#e53e3e';
        setTimeout(() => {
            email.style.borderColor = '';
        }, 3000);
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + '-error');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'שדה זה הוא חובה';
        isValid = false;
    }
    // Email validation
    else if (field.type === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'כתובת האימייל אינה תקינה';
        isValid = false;
    }
    // Phone validation
    else if (field.type === 'tel' && value && !isValidPhone(value)) {
        errorMessage = 'מספר הטלפון אינו תקין';
        isValid = false;
    }
    // Name validation
    else if (fieldName === 'name' && value && value.length < 2) {
        errorMessage = 'השם חייב להכיל לפחות 2 תווים';
        isValid = false;
    }
    // Message validation
    else if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'ההודעה חייבת להכיל לפחות 10 תווים';
        isValid = false;
    }
    
    // Update UI
    if (isValid) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    } else {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Show form success message
function showFormSuccess() {
    const successElement = document.getElementById('formSuccess');
    if (successElement) {
        successElement.style.display = 'block';
        successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Header background on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .menu-item, .testimonial-card');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation for menu tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' ? 
                    (index + 1) % tabButtons.length : 
                    (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            }
        });
    });
    
    // Announce dynamic content changes to screen readers
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Announce tab changes
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent;
            announceToScreenReader(`עבר ללשונית ${tabName}`);
        });
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                // Monitor page load performance
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here in a production environment
        // navigator.serviceWorker.register('/sw.js');
    });
}