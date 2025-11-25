document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const avatar = document.getElementById('avatar');
    const aiMessage = document.getElementById('ai-message');

    const avatarImages = [
        'char8bit/9-removebg-preview.png',
        'char8bit/8-removebg-preview.png',
        'char8bit/7-removebg-preview.png',
        'char8bit/2-removebg-preview (1).png',
        'char8bit/6-removebg-preview (1).png'
    ];

    // Set a default avatar
    avatar.src = avatarImages[0];
    aiMessage.innerText = 'Hello! Ask me anything.';

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Prompt suggestions (chips)
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

    // Work / case studies slide-in panel
    const workDetails = {
        'ai-task': {
            title: 'AI-Powered Task Management System',
            body: `
I built an AI-powered task management system that combines GPT-4o with a scalable cloud backend.

From a **product** perspective, the goal was to reduce cognitive load for users by letting them describe work in natural language and automatically structuring tasks, priorities, and deadlines.

From an **engineering** perspective, I designed a distributed architecture with FastAPI, WebSockets, and cloud infrastructure that supports 100+ concurrent users with low latency. I also used ML-based context understanding to reduce API costs while keeping the experience smooth.
            `
        },
        'ewaste': {
            title: 'E-Waste Recycling E-Commerce Platform',
            body: `
This case study comes from my Smart India Hackathon project, where we built a commerce platform for e-waste recycling.

As a **product** problem, the challenge was to connect consumers, collection centers, and recyclers in a way that feels like a familiar e-commerce experience, while surfacing the environmental impact.

On the **system side**, we used Node.js, MongoDB, and microservices to support thousands of users and hundreds of facilities, with optimised supply-chain flows, payment integration, and analytics for predicting recyclable material value.
            `
        },
        'claro': {
            title: 'Claro AI Analytics Platform',
            body: `
At Claro AI, I worked on an AI-powered analytics platform that serves 1000+ users with real-time dashboards.

From a **product management** angle, the focus was on making complex data accessible to business users by combining LLM-powered insights with familiar dashboard patterns.

On the **engineering** side, I helped design and ship cloud-native microservices with Docker, fast APIs, and streaming data pipelines that process tens of gigabytes of data per day while maintaining high uptime.
            `
        }
    };

    const workPanel = document.getElementById('work-panel');
    const workPanelTitle = document.getElementById('work-panel-title');
    const workPanelBody = document.getElementById('work-panel-body');
    const workPanelClose = document.getElementById('work-panel-close');

    function openWorkPanel(id) {
        const detail = workDetails[id];
        if (!detail || !workPanel || !workPanelTitle || !workPanelBody) return;
        workPanelTitle.textContent = detail.title;
        workPanelBody.textContent = '';
        const lines = detail.body.trim().split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line.trim();
            if (p.textContent.length > 0) {
                workPanelBody.appendChild(p);
            }
        });
        workPanel.classList.remove('panel-closed');
        workPanel.classList.add('panel-open');
    }

    function closeWorkPanel() {
        if (!workPanel) return;
        workPanel.classList.remove('panel-open');
        workPanel.classList.add('panel-closed');
    }

    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const id = card.getAttribute('data-work-id');
            if (!id) return;
            // Avoid double-firing when clicking the button by stopping propagation there
            if (e.target.classList.contains('work-open-btn') || e.currentTarget === card) {
                openWorkPanel(id);
            }
        });
    });

    if (workPanelClose) {
        workPanelClose.addEventListener('click', closeWorkPanel);
    }

    function getApiBaseUrl() {
        const isFile = location.protocol === 'file:';
        if (isFile) return 'http://localhost:3001';
        // If served from a different port than backend, prefer backend 3001
        if (location.port && location.port !== '3001') return 'http://localhost:3001';
        return '';
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';
        aiMessage.innerText = '...';
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
            appendMessage('Sorry, something went wrong.', 'ai');
        } finally {
            sendBtn.disabled = false;
        }
    }

    function appendMessage(text, sender) {
        if (sender === 'ai') {
            aiMessage.innerText = text;
            const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];
            avatar.src = randomAvatar;
        } else {
            chatLog.innerHTML = ''; // Clear previous user messages
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user-message');
            messageElement.innerText = text;
            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }
});