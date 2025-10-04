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

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userInput.value = '';
        aiMessage.innerText = '...'; // Thinking indicator

        const API_KEY = GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: messageText
                    }]
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.candidates[0].content.parts[0].text;
            appendMessage(aiResponse, 'ai');
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('Sorry, something went wrong.', 'ai');
        });
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