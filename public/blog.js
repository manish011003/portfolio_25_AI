/* ---------- Dark mode toggle (initial theme is set by an inline script before paint) ---------- */
(function () {
    const root = document.documentElement;
    const KEY = 'blog-theme';
    const current = () => (root.getAttribute('data-blog-theme') === 'dark' ? 'dark' : 'light');
    const sync = () => {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        const dark = current() === 'dark';
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('aria-pressed', String(dark));
    };
    const apply = (t, save) => {
        root.classList.add('theme-anim');
        root.setAttribute('data-blog-theme', t);
        if (save) { try { localStorage.setItem(KEY, t); } catch (e) { /* storage blocked */ } }
        sync();
        setTimeout(() => root.classList.remove('theme-anim'), 400);
    };
    document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('#theme-toggle')) apply(current() === 'dark' ? 'light' : 'dark', true);
    });
    // follow the OS setting until the visitor picks one explicitly
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let saved = null;
        try { saved = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
        if (saved !== 'dark' && saved !== 'light') apply(e.matches ? 'dark' : 'light', false);
    });
    sync();
    window.addEventListener('load', sync);
})();

// Wait for the window load event so a server-rendered React page has finished hydrating
// before this script touches the DOM.
function initBlog() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blogPosts = Array.from(document.querySelectorAll('.blog-post'));
    const searchInput = document.getElementById('blog-search');
    const emptyState = document.getElementById('blog-empty');

    /* ---------- Derived card views (built from the post list above) ---------- */
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const posts = blogPosts.map((el) => ({
        cat: el.dataset.category,
        label: el.querySelector('.post-category')?.textContent.trim() || '',
        date: el.querySelector('.post-date')?.textContent.trim() || '',
        title: el.querySelector('.post-title')?.textContent.trim() || '',
        excerpt: el.querySelector('.post-excerpt')?.textContent.trim() || '',
        href: el.querySelector('.read-more')?.getAttribute('href') || '#posts',
        icon: el.querySelector('.post-image-placeholder')?.textContent.trim() || '',
        img: el.querySelector('.post-image img')?.getAttribute('src') || '',
    }));
    const art = (p) => `<span class="art" data-cat="${esc(p.cat)}" aria-hidden="true">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : p.icon}</span>`;
    const fill = (id, html) => {
        const el = document.getElementById(id);
        if (el && !el.childElementCount) el.innerHTML = html;
    };
    const stagger = (i, base = 0.3) => `data-anim="fade-in-up" style="--del:${(base + i * 0.12).toFixed(2)}s"`;

    fill('featured-track', posts.map((p) => `
        <div class="car-item"><a class="feat-card" href="${esc(p.href)}">${art(p)}
            <div class="fc-body"><h3>${esc(p.title)}</h3>
            <p class="pm-meta"><span class="cat">${esc(p.label)}</span><i class="dot"></i><time>${esc(p.date)}</time></p></div></a></div>`).join(''));

    const [big, ...rest] = posts;
    if (big) fill('recent-big', `<a href="${esc(big.href)}">${art(big)}
        <div class="rb-body"><h3>${esc(big.title)}</h3>
        <p class="pm-meta"><span class="cat">${esc(big.label)}</span><i class="dot"></i><time>${esc(big.date)}</time></p></div></a>`);
    fill('recent-list', rest.slice(0, 3).map((p, i) => `
        <a class="r-item" href="${esc(p.href)}" ${stagger(i, 0.6)}>
            <span class="r-thumb">${art(p)}</span>
            <span><span class="r-meta"><span>${esc(p.label)}</span><i class="dot"></i><time>${esc(p.date)}</time></span>
            <h3>${esc(p.title)}</h3></span></a>`).join(''));

    fill('popular-list', posts.slice(0, 4).map((p, i) => `
        <a class="pop-item" href="${esc(p.href)}" ${stagger(i, 0.4)}>
            <span class="pop-thumb">${art(p)}</span>
            <span><span class="pop-meta"><span class="cat">${esc(p.label)}</span><i class="dot"></i><time>${esc(p.date)}</time></span>
            <h3>${esc(p.title)}</h3></span></a>`).join(''));

    fill('spot-grid', posts.slice(0, 4).map((p, i) => `
        <a class="spot-card" href="${esc(p.href)}" ${stagger(i, 0.2)}>
            <div class="s-img">${art(p)}</div>
            <p class="s-cat">${esc(p.label)}</p><h3>${esc(p.title)}</h3>
            <p>${esc(p.excerpt)}</p><p class="s-by">By Manish Biswas</p></a>`).join(''));

    /* ---------- Filter + search ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    let currentQuery = '';

    function applyFilters() {
        let visibleCount = 0;
        blogPosts.forEach((post) => {
            const category = post.getAttribute('data-category') || '';
            const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            const show = (currentFilter === 'all' || category === currentFilter) &&
                (!currentQuery || title.includes(currentQuery) || excerpt.includes(currentQuery));
            post.classList.toggle('hidden', !show);
            if (show) visibleCount++;
        });
        if (emptyState) emptyState.hidden = visibleCount > 0;
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            applyFilters();
            document.getElementById('posts')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    /* ---------- Mobile nav ---------- */
    const navToggle = document.getElementById('blog-nav-toggle');
    const navLinks = document.getElementById('blog-nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const yearEl = document.getElementById('blog-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Scroll reveal (plays once per element) ---------- */
    blogPosts.forEach((post, i) => {
        post.dataset.anim = 'fade-in';
        post.style.setProperty('--del', `${Math.min(i, 3) * 0.1}s`);
    });
    const targets = document.querySelectorAll('[data-anim]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
        targets.forEach((el) => io.observe(el));
    }

    /* ---------- Carousels (looping, arrow navigation) ---------- */
    document.querySelectorAll('[data-carousel]').forEach((root) => {
        const track = root.querySelector('.car-track');
        const scope = root.closest('.topics') || root.closest('section') || root;
        const prev = scope.querySelector('.car-prev');
        const next = scope.querySelector('.car-next');
        let index = 0;
        const pitch = () => {
            const items = track.children;
            if (items.length < 2) return items[0]?.offsetWidth || 0;
            return items[1].offsetLeft - items[0].offsetLeft;
        };
        const maxIndex = () => {
            const items = track.children;
            const last = items[items.length - 1];
            const overflow = last.offsetLeft + last.offsetWidth - root.clientWidth;
            return Math.max(0, Math.ceil(overflow / pitch()));
        };
        const go = (i) => {
            const max = maxIndex();
            index = i > max ? 0 : i < 0 ? max : i;
            track.style.transform = reduceMotion ? '' : `translate3d(${-index * pitch()}px,0,0)`;
            if (reduceMotion) root.scrollLeft = index * pitch();
        };
        prev?.addEventListener('click', () => go(index - 1));
        next?.addEventListener('click', () => go(index + 1));
        window.addEventListener('resize', () => go(Math.min(index, maxIndex())));
    });

    /* ---------- Parallax decorations (desktop only) ---------- */
    if (!reduceMotion) {
        const decos = Array.from(document.querySelectorAll('[data-parallax]'));
        const wide = window.matchMedia('(min-width: 1025px)');
        let ticking = false;
        const update = () => {
            ticking = false;
            decos.forEach((el) => {
                if (!wide.matches) { el.style.transform = ''; return; }
                const r = el.parentElement.getBoundingClientRect();
                const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed || '0.05');
                el.style.transform = el.dataset.parallax === 'x'
                    ? `translate3d(${off}px,0,0)` : `translate3d(0,${off}px,0)`;
            });
        };
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }
}

if (document.readyState === 'complete') initBlog();
else window.addEventListener('load', initBlog);
