/**
 * Google Gemini API Configuration - Production Version
 *
 * ⚠️ SECURITY WARNING:
 * For production, this contains the API key in client-side code.
 * This is acceptable for demo purposes, but for production apps,
 * consider moving Gemini API calls to your backend server.
 *
 * To use backend proxy:
 * 1. Add GEMINI_API_KEY to Vercel environment variables
 * 2. Create /api/gemini endpoint in server.js
 * 3. Update gemini-service.js to call /api/gemini instead
 */

const geminiConfig = {
    // Your Google Gemini API Key
    // For local development, copy this file to gemini.js and add your key
    // For production, update this file or use backend proxy
    apiKey: 'AIzaSyBmraiYP3uzuiWu6kFSvl9fxzRY4K2-Qu8',

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
