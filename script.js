// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;
const themeOverlay = document.querySelector('.theme-transition-overlay');
const themeOptions = document.querySelectorAll('.theme-option');

// Check for saved preferences
const savedTheme = localStorage.getItem('theme');
const savedNeumorphic = localStorage.getItem('neumorphic') === 'true';

// Apply saved preferences
if (savedTheme) {
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
}

if (savedNeumorphic) {
    body.classList.add('neumorphic');
}

// Update theme icon based on current theme
function updateThemeIcon(isDark) {
    const sunIcon = themeToggleBtn.querySelector('.fa-sun');
    const moonIcon = themeToggleBtn.querySelector('.fa-moon');
    
    if (isDark) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Create ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.className = 'ripple';
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Theme transition animation
function animateThemeTransition(event) {
    const rect = themeToggleBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Reset overlay position and state
    themeOverlay.style.left = `${centerX}px`;
    themeOverlay.style.top = `${centerY}px`;
    themeOverlay.style.transform = 'translate(-50%, -50%) scale(0)';
    themeOverlay.style.opacity = '0';
    
    // Force reflow
    themeOverlay.offsetHeight;
    
    // Start animation
    requestAnimationFrame(() => {
        themeOverlay.classList.add('active');
        themeOverlay.style.transform = 'translate(-50%, -50%) scale(4)';
        themeOverlay.style.opacity = '0.1';
    });
}

// Handle theme change
function changeTheme(theme, event) {
    const isDark = theme === 'dark';
    
    // Only change theme if it's different from current
    if (isDark !== body.classList.contains('dark-theme')) {
        body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('theme', theme);
        updateThemeIcon(isDark);
        
        if (event) {
            animateThemeTransition(event);
        }
    }
}

// Handle neumorphic toggle
function toggleNeumorphic() {
    body.classList.toggle('neumorphic');
    localStorage.setItem('neumorphic', body.classList.contains('neumorphic'));
}

// Theme toggle click handler
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        createRipple(e);
        const currentTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        changeTheme(currentTheme, e);
        toggleNeumorphic();
    });
}

// Theme options click handlers
themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        const theme = option.dataset.theme;
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            changeTheme(prefersDark ? 'dark' : 'light', e);
        } else {
            changeTheme(theme, e);
        }
    });
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'system') {
        changeTheme(e.matches ? 'dark' : 'light');
    }
});

// Ensure DOM is fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Section Visibility Observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.section-header, .skill-item, .project-card, .contact-item').forEach(el => {
        observer.observe(el);
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Add loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Replace with your EmailJS configuration
                emailjs.send('service_MichaelOladokun', 'template_MichaelOladokun', {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                })
                .then(() => {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                })
                .catch(() => {
                    showNotification('Failed to send message. Please try again.', 'error');
                });
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add typing effect to hero subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect when hero section is in view
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                heroObserver.disconnect();
            }
        });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification.success {
        background-color: var(--success);
    }

    .notification.error {
        background-color: var(--error);
    }
`;
document.head.appendChild(style);

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
}); 