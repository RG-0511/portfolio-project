document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Elements
    const chatbot = {
        toggle: document.getElementById('chatbot-toggle'),
        body: document.getElementById('chatbot-body'),
        input: document.getElementById('chat-input'),
        submit: document.getElementById('chat-submit'),
        messages: document.getElementById('chat-messages')
    };

    // Together AI Configuration
    const togetherConfig = {
        apiKey: '1c0b0f54e6c785d4ebc4dd8ed6a6ad2b8a80475809b7a0f95aba82f9960e1cfa', // Your API key
        model: 'meta-llama/Llama-3-70b-chat-hf', // Recommended model
        endpoint: 'https://api.together.xyz/v1/completions'
    };

    // Portfolio context based on your HTML
    const portfolioContext = `
        I’m Rishi Gautam, a B.Tech Civil Engineering student at IIT Ropar (2022-2026, CGPA: 7.25/10), passionate about Data Engineering and Machine Learning. My skills include:
        - Data & ML: Python, Scikit-learn, Pandas, NumPy, SQL, Power BI, Excel, Statistical Modeling
        - DevOps & Tools: Git, GitHub, Basic Web Deployment (Netlify/AWS), Structured Prompt Engineering, Jupyter Notebooks
        - Civil Engineering: Reinforced Concrete Design, Structural Analysis, Soil Mechanics, Fluid Mechanics, AutoCAD, Geomatics & Surveying
        - Libraries: Scikit-learn, Pandas, NumPy, Matplotlib, Plotly, Excel Advanced Functions
        - Currently Learning: Time Series Analysis, CI/CD Pipeline Design, Advanced Prompt Engineering, Web Deployment Strategies

        My projects include:
        - Credit Card Fraud Detection (Encryptix Internship, June-July 2024): Built an ensemble model with Logistic Regression, Decision Trees, and Random Forests, achieving 95% accuracy. Tools: Scikit-learn, Pandas, NumPy. GitHub: https://github.com/RG-0511/Encryptix
        - Spam SMS Detection (Encryptix Internship): Used TF-IDF vectorization with SVM/Naive Bayes classifiers and automated text preprocessing. Tools: NLP, Text Processing, Matplotlib. GitHub: https://github.com/RG-0511/Encryptix-3
        - Data Collection & Analysis for Transport Modeling (Jan 2025-Present): Collecting pedestrian accessibility data for metro stations, analyzing attributes for walking infrastructure. Tools: Python, Pandas, Statistical Analysis
        - Portfolio Chatbot: Integrated an AI-powered chatbot using open-source LLMs to answer queries about my work, exploring conversational AI and prompt engineering

        Experience and Leadership:
        - Machine Learning Intern at Encryptix (June-July 2024)
        - Event Coordinator for AAROHAN at IIT Ropar
        - Active member of IIT Ropar’s Coding Club

        Relevant Coursework: Reinforced Concrete Design, Structural Analysis, Fluid Mechanics, Soil Mechanics, Probability & Statistics, Linear Algebra, Data Structures, Machine Learning

        I focus on clean, efficient code and collaboration. I’m eager to explore data-driven solutions and AI innovations.
    `;

    // Toggle chatbot display
    chatbot.toggle.addEventListener('click', () => {
        const isVisible = window.getComputedStyle(chatbot.body).display === 'flex';
        chatbot.body.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            addBotMessage("Hi! I'm Rishi's portfolio assistant. Ask about my skills, projects, or experience!");
        }
    });

    // Message handling
    chatbot.submit.addEventListener('click', processInput);
    chatbot.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processInput();
    });

    async function processInput() {
        const message = chatbot.input.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatbot.input.value = '';

        try {
            const response = await callTogetherApi(message);
            addMessage(response, 'bot');
        } catch (error) {
            console.error('Chat Error:', error);
            addMessage("Sorry, something went wrong. Please try again!", 'bot');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatbot.messages.appendChild(messageDiv);
        chatbot.messages.scrollTop = chatbot.messages.scrollHeight;
    }

    function addBotMessage(text) {
        addMessage(text, 'bot');
    }

    async function callTogetherApi(userInput) {
        try {
            const response = await fetch(togetherConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${togetherConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: togetherConfig.model,
                    prompt: `
                        You are an AI assistant for Rishi Gautam's portfolio. Answer questions concisely and accurately based only on the provided context, as if you are Rishi explaining his work. If the question is unrelated or unclear, politely redirect to portfolio topics (e.g., skills, projects, experience).

                        Context: ${portfolioContext}

                        Question: ${userInput}
                        Answer:
                    `,
                    max_tokens: 300, // Reduced for faster responses
                    temperature: 0.7,
                    stop: ['</s>', 'Question:']
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].text.trim();
        } catch (error) {
            console.error('API Call Failed:', error);
            throw error;
        }
    }
});