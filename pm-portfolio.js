function animateCounter(element, target, duration = 1800) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const observerOptions = { threshold: 0.18, rootMargin: '0px 0px -80px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                if (target && !stat.hasAttribute('data-animated')) {
                    stat.setAttribute('data-animated', 'true');
                    animateCounter(stat, target);
                }
            });

            const metricValues = entry.target.querySelectorAll('.metric-value');
            metricValues.forEach(metric => {
                if (!metric.hasAttribute('data-animated')) {
                    metric.setAttribute('data-animated', 'true');
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
    /* Hero stats observe */
    const hero = document.querySelector('.pm-hero');
    if (hero) observer.observe(hero);

    document.querySelectorAll('.pm-case-study').forEach(study => observer.observe(study));

    /* Skill cards: animate on enter */
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    skillCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease-out ${index * 0.08}s`;
        skillObserver.observe(card);
    });

    /* Mobile nav toggle */
    const navToggle = document.getElementById('pm-nav-toggle');
    const navLinks = document.getElementById('pm-nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* Year */
    const yearEl = document.getElementById('pm-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
