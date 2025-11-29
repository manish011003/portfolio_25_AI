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

    // Hide loading ghost after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingGhost) {
                loadingGhost.classList.add('hidden');
            }
        }, 500);
    });

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
        'task-manager': {
            title: 'Task Manager Agent - AI-Powered WebSocket Agent',
            github: 'https://github.com/manish011003/task-manager-agent',
            body: `
A WebSocket-driven AI agent designed to help users create, organize, update, and track tasks through natural-language interaction. Built using FastAPI, Python, and OpenAI's GPT models, the system demonstrates how LLMs can be operationalized for real-world agentic workflows.

**What It Does:**
- Natural-language task creation, deletion, listing, and status updates
- Stable conversation sessions using UUID-based memory
- Notion sync to manage tasks across platforms (if configured)
- Robust error-handling, API security, and clean WebSocket-based communication
- Optional web UI for demo and testing

**Architecture Highlights:**
- WebSocket Agent (FastAPI): Core agent for message handling and tool execution
- Task Management Tools: Create, update, delete, count tasks
- Conversation Memory: Maintains chat context per session
- Streamlit Frontend: Simple UI for interacting with the agent
- REST endpoints for health checks and conversation resets

**Tech Stack:** FastAPI, Python, OpenAI GPT Models, Notion API, Streamlit, Docker, WebSockets, UUID session management
            `
        },
        'pushup-counter': {
            title: 'Push-Up Counter using MediaPipe & OpenCV',
            github: 'https://github.com/manish011003/pushup-counter',
            body: `
A real-time fitness tracking application that counts push-ups and evaluates posture using MediaPipe Pose and OpenCV. The project analyzes joint angles (shoulder, elbow, wrist) to detect movement stages and provide live feedback on form.

**What It Does:**
- Detects push-up reps using elbow angle thresholds
- Classifies stages (up/down) and increments counts automatically
- Provides real-time form feedback like "Good Form" or "Keep Body Straight"
- Displays bounding boxes and pose landmarks on video feed
- Simple start/stop interaction

**How It Works:**
- Angle Estimation: Calculates elbow angle to determine rep accuracy
- Stage Transition: Detects transitions from down → up to count one push-up
- Form Validation: Ensures correct shoulder-hip-ankle alignment
- Live Overlay: Shows rep count, stage, and posture feedback on the screen

**Tech Stack:** OpenCV, MediaPipe Pose, Python, NumPy (for angle calculations)
            `
        },
        'ewaste': {
            title: 'Hungry for E-Waste - Web Platform for E-Waste Management',
            github: 'https://github.com/manish011003/hungry-for-ewaste',
            body: `
Hungry for E-Waste is a full-stack web platform built for the SIH 2023 hackathon final round. It aims to streamline the formalized e-waste management ecosystem in India, supporting proper collection, safe transportation, segregation, and eco-friendly disposal of electronic waste.

**What It Does:**
- Organized E-Waste Collection: Track and manage e-waste pickups from individuals, institutions, and sources
- Safe Transportation: Assigns transport routes for moving e-waste to verified disposal or recycling facilities
- Smart Segregation: Automatically categorizes waste into appropriate recycling/disposal classes
- Eco-Friendly Disposal: Promotes certified disposal methods to ensure environmental safety
- User Dashboard: Users can track pickup requests, view status updates, and raise queries

**Tech Stack:** HTML, CSS, JavaScript, Node.js, Express, MongoDB, Git, GitHub
            `
        },
        'gym-buddy': {
            title: 'Gym Buddy (MVP) - AI-Powered Fitness & Nutrition Companion',
            github: 'https://github.com/manish011003/gym-buddy',
            body: `
Gym Buddy is an AI-driven personal fitness assistant designed to help users track their nutrition, calories, workouts, and long-term progress. It combines LLM-based coaching, scientific training principles, and data-driven personalization to act as a 24/7 gym partner.

**Core Features (Planned):**

1. **AI Workout Planner:**
   - Personalized routine generation using LLMs + evidence-based training research
   - Adjusts workouts based on user performance, soreness, PRs, and fatigue trends
   - Supports hypertrophy, fat loss, strength cycles, and mobility goals

2. **Nutrition & Calories Tracker:**
   - Food logging with macro/micro breakdown
   - Automatic calorie goals based on TDEE, body fat %, and progress
   - Smart recommendations: meals, supplements, hydration planning

3. **Progress Monitoring Dashboard:**
   - Body metrics: weight, body fat %, circumference changes
   - Workout analytics: volume, intensity, PR tracking, progressive overload detection
   - Weekly AI summary: what improved, what regressed, and why

4. **Supplemented Agent System:**
   - AI coach that answers questions ("Why am I not losing fat?", "Fix my form")
   - Cites scientific studies, training principles, and evidence-based nutrition
   - Context-aware responses based on user logs and past training

**MVP Tech Stack (Planned):** FastAPI or Node.js, OpenAI GPT, React Native / React, Firebase / PostgreSQL, MediaPipe + OpenCV (for form-check)
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
        
        // Add GitHub button if available
        if (detail.github) {
            const githubBtnContainer = document.createElement('div');
            githubBtnContainer.style.marginBottom = '16px';
            githubBtnContainer.innerHTML = `
                <div class="box-button" style="display: inline-block;">
                    <a href="${detail.github}" target="_blank" class="github-btn button" rel="noopener noreferrer">
                        <span>View on GitHub</span>
                    </a>
                </div>
            `;
            workPanelBody.appendChild(githubBtnContainer);
        }
        
        const lines = detail.body.trim().split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
                const p = document.createElement('p');
                // Handle markdown-style bold
                p.innerHTML = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
            // Handle clicks on button, box-button wrapper, or span
            const clickedButton = e.target.closest('.work-open-btn') || 
                                 e.target.closest('.box-button')?.querySelector('.work-open-btn');
            if (clickedButton || e.currentTarget === card) {
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