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