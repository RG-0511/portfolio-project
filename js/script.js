

document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Elements
    const chatbot = {
        toggle: document.getElementById('chatbot-toggle'),
        body: document.getElementById('chatbot-body'),
        input: document.getElementById('chat-input'),
        submit: document.getElementById('chat-submit'),
        messages: document.getElementById('chat-messages')
    };

    // --- API Configuration ---
    const geminiConfig = {
        apiKey: 'AIzaSyAAmH6nquRH5jW22mfUiinhIRnqwUXX0Y8', 
        model: 'gemini-2.5-flash-preview-05-20',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent'
    };

    // --- NEW: Full Context from the user's CV ---
    const portfolioContext = `
        My name is Rishi Gautam, a B.Tech Civil Engineering student at IIT Ropar (2022-2026) with a CGPA of 7.49.

        My technical skills include:
        - Programming Languages: Python, JavaScript, SQL, C
        - AI & Data Science: Machine Learning, Predictive Modelling, NLP, Scikit-learn, NumPy, Pandas, Matplotlib, Seaborn
        - Web Dev & Databases: Node.js, Express.js, PostgreSQL, REST APIs, HTML, CSS
        - Tools & Platforms: Git, GitHub, Render, Netlify, Excel, Power BI

        My professional experience includes:
        - Infrastructure Intern at Crashfree India (CARS24) from July 2025 - Present: Leveraged data collection techniques to identify and map accident-prone blackspots and applied survey design for Road Safety Audits.
        - Data Solutions Developer at Connectify from May 2025 - Present: Engineered a full-stack Caller CRM using Node.js and developed web automation tools with Python and Selenium.
        - Machine Learning Intern at Encryptix from June 2024 - July 2024: Developed ML models for customer churn prediction and a spam SMS detector.

        My key projects are:
        - Call Management System: A full-stack CRM with a Node.js backend and vanilla JS frontend to automate call distribution workflows.
        - AI-Powered Portfolio Website: A responsive personal website using HTML/CSS/Bootstrap with an integrated AI chatbot via the Llama 3 API.
        - EV Adoption Data Modelling: A project developing a predictive model to forecast Electric Vehicle adoption trends.
        - Transportation Modelling for Chandigarh Metro: Contributed to a team study on metro accessibility by modeling survey data using an MNL model with Biogeme (Python).

        Key Courses Taken:
        - CSE & Maths: Probability & Statistics, Differential Equations, Calculus, C & Data Structures, Industrial Management.
        - Data Science & ML: Completed "Summer Analytics 2024" from IIT Guwahati, covering Data Cleaning, ML Algorithms, Feature Engineering, & ANNs.
        - Others: AutoCAD, Transportation Engineering, Steel Structures, Foundation Engineering, Earthquake Resistant Design.

        Positions of Responsibility:
        - Event Coordinator, ATHLETICS, in AAROHAN (Annual Sports Fest, IIT Ropar, 2024).
        - Volunteer in AAROHAN (2023) and the Inter Year Sports Championship (2023).

        Achievements:
        - Winner, Bridge Making Competition, Cesafiesta 2.0, IIT Ropar (2024).
        - Silver Medal, 100m sprint, Inter Year Sports Championship, IIT Ropar (2024).
        - Gold Medal, 4x100m relay, Inter Year Sports Championship, IIT Ropar (2024).
    `;

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

    async function callGeminiApi(userInput) {
        if (!geminiConfig.apiKey || geminiConfig.apiKey === 'YOUR_GOOGLE_GEMINI_API_KEY_HERE') {
            return "API Key not configured. Please add your Google Gemini API key to the script.js file.";
        }
        
        const url = `${geminiConfig.endpoint}?key=${geminiConfig.apiKey}`;
        
        const fullPrompt = `You are a helpful AI assistant with a dual role. First, check if the user's question can be answered from the context. If so, answer based only on that context. If not, answer as a general AI assistant.
        CONTEXT:
        ---
        ${portfolioContext}
        ---
        Question: ${userInput}
        Answer:`;

        const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                return "Sorry, I couldn't generate a response for that query.";
            }
        } catch (error) {
            console.error('API Call Failed:', error);
            throw error;
        }
    }
});

