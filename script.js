document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const avatar = document.getElementById('avatar');
    const aiMessage = document.getElementById('ai-message');
    const loadingGhost = document.getElementById('loading-ghost');

    const avatarImages = [
        'char8bit/9-removebg-preview.png',
        'char8bit/8-removebg-preview.png',
        'char8bit/7-removebg-preview.png',
        'char8bit/2-removebg-preview (1).png',
        'char8bit/6-removebg-preview (1).png'
    ];

    // Hide loading overlay
    window.addEventListener('load', () => {
        setTimeout(() => loadingGhost && loadingGhost.classList.add('hidden'), 500);
    });

    if (avatar) avatar.src = avatarImages[0];
    if (aiMessage) aiMessage.innerText = 'Hello! Ask me anything.';

    /* ---------- Mobile nav toggle ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                navToggle.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Scroll reveal ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Back to top ---------- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Chat send ---------- */
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    /* ---------- Prompt chips ---------- */
    const promptContainer = document.getElementById('prompt-suggestions');
    if (promptContainer) {
        promptContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('prompt-chip')) {
                const promptText = target.getAttribute('data-prompt') || target.textContent;
                userInput.value = promptText;
                sendMessage();
            }
        });
    }

    /* ---------- Work / case studies (dynamic) ---------- */
    // Curated from github.com/manish011003 - skips portfolio clones, toys, forks/duplicates.
    const projects = [
        {
            id: 'ironclad',
            thumb: '⚔️',
            name: 'Ironclad',
            blurb: 'Cross-platform fitness app — AI meal logging, form checker, plans, XP & Spotify soundtrack.',
            tags: [
                { label: 'Expo', className: 'expo' },
                { label: 'TypeScript', className: 'typescript' },
                { label: 'Firebase', className: 'firebase' },
                { label: 'React Native', className: 'react' },
                { label: 'MediaPipe', className: 'mediapipe' }
            ],
            categories: ['ai', 'fitness', 'fullstack'],
            github: 'https://github.com/manish011003/ironclad',
            title: 'Ironclad — Cross-Platform Fitness App',
            body: `
Ironclad is a production-ready fitness app for iOS, Android, and Web — one Expo + TypeScript codebase with Firebase. Live: https://ironclad-bice.vercel.app

**What It Does:**
- Auth (email / Google / Apple) + BMI / TDEE / calorie onboarding
- Nutrition camera log (Groq → Gemini), meal sharing, gym-bro invites
- Form checker (web MediaPipe), workouts, XP / ranks, consistency analytics
- Custom training plans + Spotify soundtrack pins + medal achievements

**Tech Stack:** Expo, TypeScript, expo-router, React Native, Firebase, Groq, Gemini, MediaPipe, Vercel, EAS
            `
        },
        {
            id: 'geostocks-ai',
            thumb: '🌐',
            name: 'GeoStocks AI',
            blurb: 'Geopolitical stock intelligence — 3D globe, 8 exchanges, AI news tagging & streaming analyst.',
            tags: [
                { label: 'Next.js', className: 'nextjs' },
                { label: 'TypeScript', className: 'typescript' },
                { label: 'Three.js', className: 'threejs' },
                { label: 'Gemini', className: 'gemini' },
                { label: 'React', className: 'react' }
            ],
            categories: ['ai', 'fullstack'],
            github: 'https://github.com/manish011003/geostocks-ai',
            title: 'GeoStocks AI — Geopolitical Stock Intelligence',
            body: `
Links world events to market moves: live 3-D globe, multi-exchange watchlist, AI-tagged news, and a streaming Gemini analyst. Live: https://geostocks-ai.vercel.app

**Highlights:**
- 8 exchanges with live open/close status and currency-correct quotes
- Gemini severity / region / sector tagging + 5-signal AI prediction engine
- Three.js Earth with fly-to events and exchange focus

**Tech Stack:** Next.js, React, TypeScript, Three.js, Gemini, Yahoo Finance, Zustand
            `
        },
        {
            id: 'ai-cicd',
            thumb: '🔧',
            name: 'AI CI/CD Log Analyzer',
            blurb: 'RAG pipeline that turns Jenkins failures into root-cause analyses with a learning knowledge base.',
            tags: [
                { label: 'Python', className: 'python' },
                { label: 'FastAPI', className: 'fastapi' },
                { label: 'Next.js', className: 'nextjs' },
                { label: 'Docker', className: 'docker' },
                { label: 'Elasticsearch', className: 'elasticsearch' }
            ],
            categories: ['ai', 'devops', 'fullstack'],
            github: 'https://github.com/manish011003/ai-cicd-log-analyzer',
            title: 'AI CI/CD Log Analyzer — RAG Failure Diagnosis',
            body: `
End-to-end pipeline: Jenkins failures → LangGraph + Groq diagnosis → Next.js dashboard, with accepted fixes stored in Elasticsearch kNN for future similarity search.

**Architecture:** Jenkins listener → failure analyzer worker → Elasticsearch + Postgres → Next.js UI (Docker Compose).

**Tech Stack:** Python, FastAPI, LangGraph, Groq, Sentence-Transformers, Elasticsearch, Postgres, Next.js, Docker
            `
        },
        {
            id: 'benevolve-ai',
            thumb: '🏢',
            name: 'Benevolve AI',
            blurb: 'Agency site for custom in-house tools, business websites, and LLM-wrapper products.',
            tags: [
                { label: 'Next.js', className: 'nextjs' },
                { label: 'TypeScript', className: 'typescript' },
                { label: 'React', className: 'react' },
                { label: 'Supabase', className: 'supabase' }
            ],
            categories: ['ai', 'fullstack'],
            github: 'https://github.com/manish011003/benevolve-AI',
            title: 'Benevolve AI — In-house Software Agency Site',
            body: `
Marketing + lead-gen site for Benevolve AI: custom business websites, internal SaaS tools, and LLM-wrapper products. Live: https://benevolve-ai.vercel.app

**Highlights:**
- Positioning for fixed-scope builds (website / internal tool / AI product)
- Selected-work case cards and clear discovery → ship process
- Stack callouts for React, Next.js, Supabase, OpenAI / Claude, Stripe

**Tech Stack:** Next.js, TypeScript, React, Tailwind
            `
        },
        {
            id: 'spidey-tracker',
            thumb: '🕷️',
            name: 'Spidey Tracker',
            blurb: 'Private couples / friends pixel HUD — live map presence, missions, quizzes, spider-code invites.',
            tags: [
                { label: 'React', className: 'react' },
                { label: 'TypeScript', className: 'typescript' },
                { label: 'Firebase', className: 'firebase' },
                { label: 'Vite', className: 'vite' },
                { label: 'Leaflet', className: 'leaflet' }
            ],
            categories: ['fullstack'],
            github: 'https://github.com/manish011003/spidey_tracker',
            title: 'Spidey Tracker — Private Presence & Adventure HUD',
            body: `
Privacy-first couples / friends web app with a homemade pixel Spider HUD: dark map, live presence, missions, quizzes, and spider-code invites. Live: https://spidey-tracker-pi.vercel.app

**What It Does:**
- Google sign-in + onboarding (role / spider / suit)
- Partner link (1:1) and friends with request flows
- Leaflet map with opt-in location, nearby landmark quests (Overpass)
- Adventure loop: XP, levels, suits, quizzes, missions, achievements

**Tech Stack:** React 19, TypeScript, Vite, Tailwind, Firebase Auth / Firestore / Realtime DB, Leaflet, Vercel
            `
        },
        {
            id: 'task-manager',
            thumb: '🤖',
            name: 'Task Manager Agent',
            blurb: 'AI-powered WebSocket agent for natural-language task management with Notion sync.',
            tags: [
                { label: 'Python', className: 'python' },
                { label: 'FastAPI', className: 'fastapi' },
                { label: 'WebSocket', className: 'websocket' },
                { label: 'OpenAI', className: 'openai' },
                { label: 'Docker', className: 'docker' }
            ],
            categories: ['ai', 'fullstack'],
            github: 'https://github.com/manish011003/AI-task-manager-agent-main',
            title: 'Task Manager Agent — AI-Powered WebSocket Agent',
            body: `
WebSocket-driven AI agent for creating, organizing, and tracking tasks via natural language — FastAPI + OpenAI GPT with optional Notion sync.

**Highlights:**
- NL task CRUD + UUID conversation memory
- Tool-calling agent over WebSockets
- Streamlit demo UI + Docker packaging

**Tech Stack:** FastAPI, Python, OpenAI, Notion API, Streamlit, Docker, WebSockets
            `
        },
        {
            id: 'pushup-counter',
            thumb: '💪',
            name: 'Push-Up Counter',
            blurb: 'Real-time fitness tracking using MediaPipe Pose and OpenCV for form analysis.',
            tags: [
                { label: 'Python', className: 'python' },
                { label: 'OpenCV', className: 'opencv' },
                { label: 'MediaPipe', className: 'mediapipe' },
                { label: 'NumPy', className: 'numpy' }
            ],
            categories: ['ai', 'fitness'],
            github: 'https://github.com/manish011003/push-up-counter',
            title: 'Push-Up Counter using MediaPipe & OpenCV',
            body: `
Counts push-ups and evaluates posture in real time from webcam pose landmarks.

**Highlights:**
- Elbow-angle rep detection (up / down stages)
- Shoulder–hip–ankle form feedback overlay
- Live count, stage, and angle HUD

**Tech Stack:** OpenCV, MediaPipe Pose, Python, NumPy
            `
        },
        {
            id: 'panipurirush',
            thumb: '🍽️',
            name: 'Pani Puri Rush',
            blurb: 'Pac-Man style browser game — eat pani puris, grab chillies, dodge water glasses.',
            tags: [
                { label: 'JavaScript', className: 'javascript' },
                { label: 'HTML/CSS', className: 'html' }
            ],
            categories: ['games', 'fullstack'],
            github: 'https://github.com/manish011003/panipurirush',
            title: 'Pani Puri Rush — Browser Arcade Game',
            body: `
Pac-Man style browser game built with HTML, CSS, and vanilla JavaScript. Live: https://panipurirush.vercel.app

**How to Play:**
- Easy / Medium / Hard difficulties
- Arrow keys, WASD, swipe, or on-screen pad
- Eat every pani puri; chillies frighten water-glass enemies
- 3 lives

**Tech Stack:** HTML, CSS, JavaScript
            `
        },
        {
            id: 'superstorewise',
            thumb: '🛒',
            name: 'Superstorewise',
            blurb: 'Expo / React Native storefront app with file-based routing and Axios API calls.',
            tags: [
                { label: 'Expo', className: 'expo' },
                { label: 'TypeScript', className: 'typescript' },
                { label: 'React Native', className: 'react' }
            ],
            categories: ['fullstack'],
            github: 'https://github.com/manish011003/Superstorewise',
            title: 'Superstorewise — Expo Storefront App',
            body: `
Cross-platform storefront built with Expo Router — React Native UI talking to APIs via Axios.

**Highlights:**
- File-based routing with expo-router
- Universal app targets (iOS / Android / web via Expo)
- Modular React Native screens for product browsing flows

**Tech Stack:** Expo, React Native, TypeScript, Axios, expo-router
            `
        },
        {
            id: 'decoy',
            thumb: '🎯',
            name: 'DECOY Website',
            blurb: 'Official marketing site for DECOY — shipped as a polished static web presence.',
            tags: [
                { label: 'HTML/CSS', className: 'html' },
                { label: 'JavaScript', className: 'javascript' }
            ],
            categories: ['fullstack'],
            github: 'https://github.com/manish011003/DECOYwebsrc',
            title: 'DECOY — Official Organization Website',
            body: `
The official website of DECOY — a static marketing site with custom layout, assets, and responsive pages. Live: https://decoywebsrc.vercel.app

**Tech Stack:** HTML, CSS, JavaScript, Vercel
            `
        },
        {
            id: 'aasaan',
            thumb: '📦',
            name: 'Aasaan',
            blurb: 'Lightweight landing + order funnel — “get things aasaani se” with Google Forms checkout.',
            tags: [
                { label: 'HTML/CSS', className: 'html' },
                { label: 'JavaScript', className: 'javascript' }
            ],
            categories: ['fullstack'],
            github: 'https://github.com/manish011003/aasaan',
            title: 'Aasaan — Landing & Order Funnel',
            body: `
Minimal product landing page with clear CTA into a Google Forms order flow. Live: https://aasaan.vercel.app

**Tech Stack:** HTML, CSS, JavaScript, Vercel
            `
        },
        {
            id: 'ewaste',
            thumb: '♻️',
            name: 'Hungry for E-Waste (SIH)',
            blurb: 'Full-stack e-waste management platform — Smart India Hackathon 2023 finalist solution.',
            tags: [
                { label: 'JavaScript', className: 'javascript' },
                { label: 'Node.js', className: 'nodejs' },
                { label: 'Express', className: 'express' },
                { label: 'MongoDB', className: 'mongodb' },
                { label: 'HTML/CSS', className: 'html' }
            ],
            categories: ['fullstack'],
            github: 'https://github.com/manish011003/sih2023final',
            title: 'Hungry for E-Waste — SIH 2023 Finalist',
            body: `
Full-stack platform built for Smart India Hackathon 2023 to formalize e-waste collection, transport, segregation, and disposal.

**What It Does:**
- Pickup tracking for individuals and institutions
- Transport routing to verified facilities
- Segregation classes and eco-friendly disposal flows
- User dashboard for request status

**Tech Stack:** HTML, CSS, JavaScript, Node.js, Express, MongoDB
            `
        }
    ];

    const workPanel = document.getElementById('work-panel');
    const workPanelTitle = document.getElementById('work-panel-title');
    const workPanelBody = document.getElementById('work-panel-body');
    const workPanelClose = document.getElementById('work-panel-close');
    const caseRow = document.getElementById('case-row');
    const workFilters = document.getElementById('work-filters');
    let activeFilter = 'all';
    let renderToken = 0;

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getFilteredProjects(filter) {
        if (filter === 'all') return projects;
        return projects.filter((p) => p.categories.includes(filter));
    }

    function createWorkCard(project, index) {
        const article = document.createElement('article');
        article.className = 'work-card';
        article.dataset.workId = project.id;
        article.style.setProperty('--card-i', String(index));

        const tagsHtml = project.tags
            .map((t) => `<span class="tech-tag ${escapeHtml(t.className)}">${escapeHtml(t.label)}</span>`)
            .join('');

        article.innerHTML = `
            <div class="work-thumb">${escapeHtml(project.thumb)}</div>
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.blurb)}</p>
            <div class="tech-tags">${tagsHtml}</div>
            <div class="work-card-buttons">
                <div class="box-button">
                    <button type="button" class="work-open-btn button"><span>Details</span></button>
                </div>
                <div class="box-button alt">
                    <a href="${escapeHtml(project.github)}" target="_blank" class="github-btn button" rel="noopener noreferrer"><span>GitHub</span></a>
                </div>
            </div>
        `;
        return article;
    }

    function renderProjects(filter, { animate = true } = {}) {
        if (!caseRow) return;
        const token = ++renderToken;
        const list = getFilteredProjects(filter);

        const paint = () => {
            if (token !== renderToken) return;
            caseRow.innerHTML = '';

            if (!list.length) {
                const empty = document.createElement('p');
                empty.className = 'work-empty';
                empty.textContent = 'No projects in this category yet.';
                caseRow.appendChild(empty);
                return;
            }

            list.forEach((project, i) => {
                const card = createWorkCard(project, i);
                if (animate) card.classList.add('is-entering');
                caseRow.appendChild(card);
            });

            if (animate) {
                requestAnimationFrame(() => {
                    caseRow.querySelectorAll('.work-card.is-entering').forEach((card) => {
                        card.classList.add('is-visible');
                    });
                });
            }
        };

        if (animate && caseRow.children.length) {
            caseRow.classList.add('is-swapping');
            window.setTimeout(() => {
                if (token !== renderToken) return;
                caseRow.classList.remove('is-swapping');
                paint();
            }, 160);
        } else {
            paint();
        }
    }

    function openWorkPanel(id) {
        const detail = projects.find((p) => p.id === id);
        if (!detail || !workPanel || !workPanelTitle || !workPanelBody) return;
        workPanelTitle.textContent = detail.title;
        workPanelBody.textContent = '';

        if (detail.github) {
            const githubBtnContainer = document.createElement('div');
            githubBtnContainer.style.marginBottom = '16px';
            githubBtnContainer.innerHTML = `
                <div class="box-button alt" style="display: inline-block;">
                    <a href="${escapeHtml(detail.github)}" target="_blank" class="github-btn button" rel="noopener noreferrer">
                        <span>View on GitHub</span>
                    </a>
                </div>
            `;
            workPanelBody.appendChild(githubBtnContainer);
        }

        const lines = detail.body.trim().split('\n');
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
                const p = document.createElement('p');
                p.innerHTML = escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                workPanelBody.appendChild(p);
            }
        });
        workPanel.classList.remove('panel-closed');
        workPanel.classList.add('panel-open');
        document.body.style.overflow = 'hidden';
    }

    function closeWorkPanel() {
        if (!workPanel) return;
        workPanel.classList.remove('panel-open');
        workPanel.classList.add('panel-closed');
        document.body.style.overflow = '';
    }

    if (caseRow) {
        caseRow.addEventListener('click', (e) => {
            const card = e.target.closest('.work-card');
            if (!card) return;
            if (e.target.closest('.github-btn')) return;
            const id = card.getAttribute('data-work-id');
            if (id) openWorkPanel(id);
        });
    }

    if (workFilters) {
        workFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.work-filter');
            if (!btn) return;
            const next = btn.getAttribute('data-filter') || 'all';
            if (next === activeFilter) return;
            activeFilter = next;
            workFilters.querySelectorAll('.work-filter').forEach((el) => {
                const on = el === btn;
                el.classList.toggle('is-active', on);
                el.setAttribute('aria-selected', String(on));
            });
            renderProjects(activeFilter);
        });
    }

    if (workPanelClose) workPanelClose.addEventListener('click', closeWorkPanel);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeWorkPanel();
    });

    renderProjects(activeFilter, { animate: true });

    /* ---------- API ---------- */
    function getApiBaseUrl() {
        const isFile = location.protocol === 'file:';
        if (isFile) return 'http://localhost:3001';
        if (location.port && location.port !== '3001') return 'http://localhost:3001';
        return '';
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';
        showTyping(true);
        sendBtn.disabled = true;

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => '');
                throw new Error(`HTTP ${response.status} ${errText}`);
            }
            const data = await response.json();
            appendMessage(data.reply || 'No reply', 'ai');
        } catch (error) {
            console.error('Error:', error);
            appendMessage('Sorry, my brain glitched. Try again in a moment.', 'ai');
        } finally {
            showTyping(false);
            sendBtn.disabled = false;
        }
    }

    let typingTimer = null;
    function showTyping(isOn) {
        if (!aiMessage) return;
        if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
        if (isOn) {
            const dots = ['.', '..', '...'];
            let i = 0;
            aiMessage.innerText = 'thinking.';
            typingTimer = setInterval(() => {
                aiMessage.innerText = 'thinking' + dots[i++ % dots.length];
            }, 400);
        }
    }

    function appendMessage(text, sender) {
        if (sender === 'ai') {
            typewriter(aiMessage, text);
            const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];
            avatar.src = randomAvatar;
        } else {
            chatLog.innerHTML = '';
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user-message');
            messageElement.innerText = text;
            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }

    /* Simple typewriter for AI replies (skips on long text) */
    function typewriter(el, text) {
        if (!el) return;
        if (text.length > 240) { el.innerText = text; return; }
        el.innerText = '';
        let i = 0;
        const speed = 18;
        const tick = () => {
            el.innerText = text.slice(0, i++);
            if (i <= text.length) setTimeout(tick, speed);
        };
        tick();
    }
});
