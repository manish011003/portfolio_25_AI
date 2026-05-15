document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    const searchInput = document.getElementById('blog-search');
    const emptyState = document.getElementById('blog-empty');

    let currentFilter = 'all';
    let currentQuery = '';

    function applyFilters() {
        let visibleCount = 0;
        blogPosts.forEach((post, index) => {
            const category = post.getAttribute('data-category') || '';
            const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesQuery = !currentQuery || title.includes(currentQuery) || excerpt.includes(currentQuery);
            const show = matchesFilter && matchesQuery;

            if (show) {
                post.classList.remove('hidden');
                post.style.transition = 'all 0.4s ease-out';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
                post.style.transitionDelay = `${index * 0.04}s`;
                visibleCount++;
            } else {
                post.style.transition = 'all 0.25s ease-out';
                post.style.opacity = '0';
                post.style.transform = 'translateY(-10px)';
                setTimeout(() => post.classList.add('hidden'), 250);
            }
        });
        if (emptyState) emptyState.hidden = visibleCount > 0;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    /* Mobile nav */
    const navToggle = document.getElementById('blog-nav-toggle');
    const navLinks = document.getElementById('blog-nav-links');
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
    const yearEl = document.getElementById('blog-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Subtle scroll-in for posts */
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    blogPosts.forEach(post => observer.observe(post));
});
