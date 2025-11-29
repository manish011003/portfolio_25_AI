// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate counters if it's a stat number
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && !stat.hasAttribute('data-animated')) {
                    stat.setAttribute('data-animated', 'true');
                    animateCounter(stat, target);
                }
            });

            // Animate metric values
            const metricValues = entry.target.querySelectorAll('.metric-value');
            metricValues.forEach(metric => {
                if (!metric.hasAttribute('data-animated')) {
                    metric.setAttribute('data-animated', 'true');
                    const text = metric.textContent;
                    metric.style.opacity = '0';
                    metric.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        metric.style.transition = 'all 0.5s ease-out';
                        metric.style.opacity = '1';
                        metric.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Observe case studies
    const caseStudies = document.querySelectorAll('.pm-case-study');
    caseStudies.forEach(study => {
        observer.observe(study);
    });

    // Observe skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
        
        observer.observe(card);
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.pm-hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
});

