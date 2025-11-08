document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Elements
    const chatbot = {
        toggle: document.getElementById('chatbot-toggle'),
        body: document.getElementById('chatbot-body'),
        input: document.getElementById('chat-input'),
        submit: document.getElementById('chat-submit'),
        messages: document.getElementById('chat-messages')
    };

    // --- API Configuration & Context REMOVED ---
    // All secret data is now in your Netlify Function

    let isFirstMessage = true;
    let isBotTyping = false; // State to prevent user input while bot is typing

    // Toggle chatbot display
    chatbot.toggle.addEventListener('click', () => {
        const isVisible = window.getComputedStyle(chatbot.body).display === 'flex';
        chatbot.body.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && isFirstMessage) {
            // Use typeOutMessage for the first message as well
            const firstMessageDiv = document.createElement('div');
            firstMessageDiv.className = 'message bot-message';
            chatbot.messages.appendChild(firstMessageDiv);
            typeOutMessage("Hi! I'm Rishi's portfolio assistant. Ask me about my skills, projects, or experience!", firstMessageDiv);
            isFirstMessage = false;
        }
    });

    // Message handling
    chatbot.submit.addEventListener('click', processInput);
    chatbot.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processInput();
    });

    async function processInput() {
        if (isBotTyping) return; // Don't process new input while bot is typing

        const message = chatbot.input.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatbot.input.value = '';
        
        addTypingIndicator();

        try {
            // This now calls your secure Netlify Function
            const response = await callGeminiApi(message); 
            removeTypingIndicator();
            // Create a new div for the response to be typed into
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot-message';
            chatbot.messages.appendChild(botMessageDiv);
            typeOutMessage(response, botMessageDiv);
        } catch (error) {
            console.error('Chat Error:', error);
            removeTypingIndicator();
            // Create a new div for the error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message bot-message';
            chatbot.messages.appendChild(errorDiv);
            typeOutMessage("Sorry, I encountered an error. Please try again in a moment.", errorDiv);
        }
    }

    // UPDATED: addMessage now ONLY handles user messages
    function addMessage(text, sender) {
        if (sender === 'user') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;
            chatbot.messages.appendChild(messageDiv);
            chatbot.messages.scrollTop = chatbot.messages.scrollHeight;
        }
    }
    
    // NEW: Function to create the typing effect
    function typeOutMessage(text, element) {
        isBotTyping = true;
        chatbot.input.disabled = true;
        chatbot.submit.disabled = true;

        let i = 0;
        const typingSpeed = 20; // milliseconds per character

        element.textContent = ''; // Ensure the element is empty before typing

        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Scroll to the bottom after each character is added
                chatbot.messages.scrollTop = chatbot.messages.scrollHeight;
            } else {
                clearInterval(interval);
                isBotTyping = false;
                chatbot.input.disabled = false;
                chatbot.submit.disabled = false;
                chatbot.input.focus();
            }
        }, typingSpeed);
    }
    
    function addTypingIndicator() {
        if (chatbot.messages.querySelector('.typing-indicator')) return; // Don't add if one already exists
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbot.messages.appendChild(typingDiv);
        chatbot.messages.scrollTop = chatbot.messages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = chatbot.messages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // --- ENTIRELY REPLACED ---
    // This function is now simple. It just calls your secure Netlify Function.
    async function callGeminiApi(userInput) {
        
        // This is the path to your new secure function
        const url = '/.netlify/functions/chat';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // We only send the user's question
                body: JSON.stringify({ userInput: userInput }) 
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error || response.statusText}`);
            }
    
            const data = await response.json();
            return data.reply; // Get the safe reply from our function
            
        } catch (error) {
            console.error('API Call Failed:', error);
            throw error;
        }
    }
});