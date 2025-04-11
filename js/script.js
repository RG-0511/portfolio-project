document.addEventListener('DOMContentLoaded', function() {
    // Toggle chatbot visibility
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBody = document.getElementById('chatbot-body');
    
    chatbotToggle.addEventListener('click', function() {
        if (chatbotBody.style.display === 'flex') {
            chatbotBody.style.display = 'none';
        } else {
            chatbotBody.style.display = 'flex';
            // Add initial greeting message
            addBotMessage("Hello! I'm your personal assistant. Ask me anything about my skills, experience, or projects.");
        }
    });
    
    // Handle chat submission
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chat-messages');
    
    function handleChatSubmit() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addUserMessage(message);
            // Clear input
            chatInput.value = '';
            // Process with chatbot (to be implemented in Phase 3)
            processChatbotResponse(message);
        }
    }
    
    chatSubmit.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });
    
    // Add messages to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Temporary function - will be replaced with actual chatbot integration
    function processChatbotResponse(message) {
        // Simulate typing delay
        setTimeout(() => {
            // This is a placeholder - will be replaced with actual chatbot logic
            const responses = {
                'skills': 'I specialize in Data Analysis and DevOps. My technical skills include Python, SQL, Git, CI/CD pipelines, and cloud deployment.',
                'experience': 'I have experience in data analysis, software development, and DevOps practices. Check my resume for detailed work history.',
                'education': 'I studied Computer Science and have continuously expanded my knowledge through professional certifications.',
                'projects': 'I have worked on various projects involving data analysis, web development, and infrastructure automation.'
            };
            
            // Simple keyword matching
            let botResponse = "I'm sorry, I don't understand that question. Try asking about my skills, experience, education, or projects.";
            
            for (const [key, response] of Object.entries(responses)) {
                if (message.toLowerCase().includes(key)) {
                    botResponse = response;
                    break;
                }
            }
            
            addBotMessage(botResponse);
        }, 1000);
    }
});
