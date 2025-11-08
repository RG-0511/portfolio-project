// This is the complete, final code for: netlify/functions/chat.js

// 1. The portfolioContext (copied from your original script.js)
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

// 2. The Netlify Function handler
exports.handler = async (event) => {
    // Get the user's message from the browser
    const { userInput } = JSON.parse(event.body);

    // Get the secret API key from Netlify's settings
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API Key not configured' }) };
    }

    // Define the Google API endpoint
    const model = 'gemini-2.5-flash-preview-05-20';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Build the full prompt on the server
    const fullPrompt = `You are a helpful AI assistant with a dual role. First, check if the user's question can be answered from the context. If so, answer based only on that context. If not, answer as a general AI assistant.
    CONTEXT:
    ---
    ${portfolioContext}
    ---
    Question: ${userInput}
    Answer:`;

    const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };

    // Call the Google API securely from the server
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.error?.message || 'Google API error' })
            };
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const botResponse = data.candidates[0].content.parts[0].text.trim();
            // Send ONLY the safe response back to the browser
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: botResponse })
            };
        } else {
             return {
                statusCode: 500,
                body: JSON.stringify({ error: "Sorry, I couldn't generate a response." })
            };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};