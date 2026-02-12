// ===== MAIN JAVASCRIPT =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initAppointmentForm();
    initAnimations();
    initScrollToTop();
    initCaseStudyDownloads();
    setMinDate();
});

// =====NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    const navLinkElements = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinkElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Smooth scroll for all internal links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Get all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== APPOINTMENT FORM =====
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate form
            if (validateForm(data)) {
                // Create mailto link with form data
                const subject = encodeURIComponent('Consultation Request from ' + data.fullName);
                const body = encodeURIComponent(
                    `Name: ${data.fullName}\n` +
                    `Email: ${data.email}\n` +
                    `Company: ${data.company || 'N/A'}\n` +
                    `Phone: ${data.phone || 'N/A'}\n` +
                    `Preferred Date: ${data.appointmentDate}\n` +
                    `Preferred Time: ${data.appointmentTime}\n` +
                    `Message:\n${data.message || 'N/A'}`
                );
                
                // In a real application, you would send this to a backend
                // For now, we'll show success message and optionally open mailto
                
                // Show success message
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Optional: Open email client
                // window.location.href = `mailto:contact@strategiccp.com?subject=${subject}&body=${body}`;
                
                // Store appointment in localStorage (for demo purposes)
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                appointments.push({
                    ...data,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('appointments', JSON.stringify(appointments));
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    formSuccess.style.display = 'none';
                }, 5000);
            }
        });
    }
}

function validateForm(data) {
    // Basic validation
    if (!data.fullName || data.fullName.trim() === '') {
        alert('Please enter your full name.');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (!data.appointmentDate) {
        alert('Please select a preferred date.');
        return false;
    }
    
    if (!data.appointmentTime) {
        alert('Please select a preferred time.');
        return false;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(data.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date.');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Counter animation for hero stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/\D/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current).toString();
            if (isPercentage) displayValue += '%';
            if (isPlus) displayValue += '+';
            
            element.textContent = displayValue;
        }, stepTime);
    };
    
    // Use Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CASE STUDY DOWNLOADS =====
function initCaseStudyDownloads() {
    const downloadLinks = document.querySelectorAll('.case-study-download');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get case study title from parent card
            const card = this.closest('.case-study-card');
            const title = card.querySelector('h3').textContent;
            
            // In a real application, this would trigger an actual download
            // For now, show a message
            alert(`Thank you for your interest in "${title}". In a production environment, the PDF would download automatically. Please contact us at contact@strategiccp.com to receive this case study.`);
            
            // Track download (for analytics)
            console.log('Case study download requested:', title);
            
            // Store download in localStorage (for demo purposes)
            const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
            downloads.push({
                title: title,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('downloads', JSON.stringify(downloads));
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== CONSOLE MESSAGE =====
console.log('%c Strategic Consulting Partners ', 'background: #1e40af; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c Landing Page Loaded Successfully ', 'background: #10b981; color: white; padding: 5px 10px; font-size: 12px;');