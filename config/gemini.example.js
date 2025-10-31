/**
 * Google Gemini API Configuration Template
 *
 * Setup Instructions:
 * 1. Copy this file to gemini.js in the same directory
 * 2. Replace YOUR_GEMINI_API_KEY with your actual API key from https://aistudio.google.com/apikey
 * 3. NEVER commit gemini.js to GitHub (it's in .gitignore)
 */

const geminiConfig = {
    // Your Google Gemini API Key
    apiKey: 'YOUR_GEMINI_API_KEY',

    // API Endpoints
    endpoints: {
        generateContent: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        imageGeneration: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'
    },

    // Model Configuration
    model: 'gemini-2.5-flash-image',

    // Generation Config
    generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
    },

    // Safety Settings
    safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
};

// Export for browser
if (typeof window !== 'undefined') {
    window.GeminiConfig = geminiConfig;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = geminiConfig;
}
