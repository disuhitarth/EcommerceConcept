/**
 * Google Gemini API Service
 * Handles AI image generation and enhancement
 */

class GeminiService {
    constructor() {
        this.config = window.GeminiConfig;
        if (!this.config || !this.config.apiKey || this.config.apiKey === 'YOUR_GEMINI_API_KEY') {
            console.warn('Gemini API not configured. Please set your API key in config/gemini.js');
        }
    }

    /**
     * Check if Gemini is properly configured
     */
    isConfigured() {
        return this.config &&
               this.config.apiKey &&
               this.config.apiKey !== 'YOUR_GEMINI_API_KEY' &&
               this.config.apiKey.length > 20;
    }

    /**
     * Generate product image from text description
     * @param {string} prompt - Description of the product image to generate
     * @param {Object} options - Generation options
     * @returns {Promise<string>} - Base64 encoded image
     */
    async generateProductImage(prompt, options = {}) {
        console.log('=== Gemini generateProductImage called ===');
        console.log('User prompt:', prompt);
        console.log('Options:', options);

        if (!this.isConfigured()) {
            console.error('Gemini API is not configured');
            throw new Error('Gemini API is not configured');
        }

        const fullPrompt = this._buildProductPrompt(prompt, options);
        console.log('Full prompt sent to API:', fullPrompt);

        const requestPayload = {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                ...this.config.generationConfig
            },
            safetySettings: this.config.safetySettings
        };

        console.log('Request payload structure:', {
            endpoint: this.config.endpoints.imageGeneration,
            apiKeyLength: this.config.apiKey.length,
            generationConfig: requestPayload.generationConfig,
            safetySettingsCount: requestPayload.safetySettings.length
        });

        try {
            console.log('Sending request to Gemini API...');
            const response = await fetch(
                this.config.endpoints.imageGeneration,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.config.apiKey
                    },
                    body: JSON.stringify(requestPayload)
                }
            );

            console.log('Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', JSON.stringify(errorData, null, 2));
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API response structure:', {
                hasCandidates: !!data.candidates,
                candidatesCount: data.candidates?.length,
                firstCandidate: data.candidates?.[0] ? {
                    hasContent: !!data.candidates[0].content,
                    partsCount: data.candidates[0].content?.parts?.length
                } : null
            });
            console.log('Full API response:', JSON.stringify(data, null, 2));

            // Extract image from response
            if (data.candidates && data.candidates[0]) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            // Return base64 image with proper data URI
                            const mimeType = part.inlineData.mimeType || 'image/png';
                            console.log('✓ Successfully extracted image, size:', part.inlineData.data.length);
                            return `data:${mimeType};base64,${part.inlineData.data}`;
                        }
                    }
                }
            }

            console.error('No image found in response parts');
            throw new Error('No image found in response');
        } catch (error) {
            console.error('=== Gemini API Error ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    /**
     * Enhance an existing product image
     * @param {string} imageBase64 - Base64 encoded image
     * @param {string} instructions - Enhancement instructions
     * @returns {Promise<string>} - Enhanced image as base64
     */
    async enhanceImage(imageBase64, instructions) {
        console.log('=== Gemini enhanceImage called ===');
        console.log('Instructions:', instructions);
        console.log('Image data length:', imageBase64.length);

        if (!this.isConfigured()) {
            console.error('Gemini API is not configured');
            throw new Error('Gemini API is not configured');
        }

        // Remove data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        console.log('Base64 data length after cleanup:', base64Data.length);

        const requestPayload = {
            contents: [{
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data
                        }
                    },
                    {
                        text: instructions
                    }
                ]
            }],
            generationConfig: {
                ...this.config.generationConfig
            },
            safetySettings: this.config.safetySettings
        };

        console.log('Request payload structure:', {
            endpoint: this.config.endpoints.imageGeneration,
            apiKeyLength: this.config.apiKey.length,
            contentsParts: requestPayload.contents[0].parts.length,
            generationConfig: requestPayload.generationConfig,
            safetySettingsCount: requestPayload.safetySettings.length
        });

        try {
            console.log('Sending request to Gemini API...');
            const response = await fetch(
                this.config.endpoints.imageGeneration,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.config.apiKey
                    },
                    body: JSON.stringify(requestPayload)
                }
            );

            console.log('Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', JSON.stringify(errorData, null, 2));
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API response structure:', {
                hasCandidates: !!data.candidates,
                candidatesCount: data.candidates?.length,
                firstCandidate: data.candidates?.[0] ? {
                    hasContent: !!data.candidates[0].content,
                    partsCount: data.candidates[0].content?.parts?.length
                } : null
            });
            console.log('Full API response:', JSON.stringify(data, null, 2));

            // Extract enhanced image
            if (data.candidates && data.candidates[0]) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            const mimeType = part.inlineData.mimeType || 'image/png';
                            console.log('✓ Successfully extracted image, size:', part.inlineData.data.length);
                            return `data:${mimeType};base64,${part.inlineData.data}`;
                        }
                    }
                }
            }

            console.error('No image found in response parts');
            throw new Error('No enhanced image found in response');
        } catch (error) {
            console.error('=== Gemini Enhancement Error ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    /**
     * Build a comprehensive prompt for product image generation
     * @private
     */
    _buildProductPrompt(userPrompt, options = {}) {
        const {
            background = 'pure white professional e-commerce background',
            style = 'professional product photography',
            lighting = 'studio lighting with soft shadows',
            angle = 'front facing view',
            quality = 'high resolution, sharp focus'
        } = options;

        return `Generate a ${style} image of: ${userPrompt}.

Requirements:
- Background: ${background}
- Lighting: ${lighting}
- Camera angle: ${angle}
- Quality: ${quality}
- No text or watermarks
- Professional e-commerce product shot
- Clean and minimal composition
- Suitable for online store listing

Generate only the image, no text descriptions.`;
    }

    /**
     * Generate multiple variations of a product image
     * @param {string} prompt - Product description
     * @param {number} count - Number of variations (1-5)
     * @returns {Promise<Array<string>>} - Array of base64 images
     */
    async generateVariations(prompt, count = 3) {
        if (!this.isConfigured()) {
            throw new Error('Gemini API is not configured');
        }

        const variations = [];
        const styles = [
            { background: 'pure white background', angle: 'front view' },
            { background: 'subtle gradient background', angle: '45 degree angle' },
            { background: 'lifestyle setting', angle: 'slight side angle' }
        ];

        for (let i = 0; i < Math.min(count, styles.length); i++) {
            try {
                const image = await this.generateProductImage(prompt, styles[i]);
                variations.push(image);
            } catch (error) {
                console.error(`Failed to generate variation ${i + 1}:`, error);
                // Continue with other variations
            }
        }

        return variations;
    }

    /**
     * Analyze product image and generate product details
     * @param {string} imageBase64 - Base64 encoded image
     * @returns {Promise<Object>} - Product details (name, description, price, category)
     */
    async analyzeProductImage(imageBase64) {
        console.log('=== Gemini analyzeProductImage called ===');

        if (!this.isConfigured()) {
            console.error('Gemini API is not configured');
            throw new Error('Gemini API is not configured');
        }

        // Remove data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `Analyze this product image and provide the following information in JSON format:
{
  "name": "A catchy, SEO-friendly product name (3-8 words)",
  "description": "A detailed product description for e-commerce (2-3 sentences, highlight features and benefits)",
  "suggestedPrice": "Suggested retail price range in USD (e.g., '$25-$35')",
  "category": "Product category (e.g., 'Apparel', 'Electronics', 'Home Goods')",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "features": ["feature1", "feature2", "feature3"]
}

Make it compelling and suitable for an online store. Focus on what makes this product appealing.`;

        try {
            console.log('Analyzing product image...');
            const response = await fetch(
                this.config.endpoints.generateContent,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.config.apiKey
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                {
                                    inlineData: {
                                        mimeType: 'image/png',
                                        data: base64Data
                                    }
                                },
                                {
                                    text: prompt
                                }
                            ]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        }
                    })
                }
            );

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', JSON.stringify(errorData, null, 2));
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API response:', JSON.stringify(data, null, 2));

            // Extract text from response
            if (data.candidates && data.candidates[0]) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            console.log('Raw text response:', part.text);
                            // Try to extract JSON from the response
                            const jsonMatch = part.text.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                const productData = JSON.parse(jsonMatch[0]);
                                console.log('✓ Successfully parsed product data:', productData);
                                return productData;
                            }
                        }
                    }
                }
            }

            throw new Error('No valid product data found in response');
        } catch (error) {
            console.error('=== Gemini Analysis Error ===');
            console.error('Error:', error);
            throw error;
        }
    }

    /**
     * Optimize/improve existing text content
     * @param {string} text - Original text
     * @param {string} fieldType - Type of field (e.g., 'name', 'description', 'tags')
     * @returns {Promise<string>} - Optimized text
     */
    async optimizeText(text, fieldType = 'description') {
        console.log('=== Gemini optimizeText called ===');
        console.log('Field type:', fieldType);
        console.log('Original text:', text);

        if (!this.isConfigured()) {
            console.error('Gemini API is not configured');
            throw new Error('Gemini API is not configured');
        }

        const prompts = {
            name: `Improve this product name to be more catchy, SEO-friendly, and appealing for e-commerce. Keep it concise (3-8 words). Original: "${text}"

Return only the improved product name, nothing else.`,

            description: `Improve this product description for e-commerce. Make it more compelling, highlight benefits, and optimize for conversions. Keep it concise (2-4 sentences). Original: "${text}"

Return only the improved description, nothing else.`,

            tags: `Improve this list of product tags/keywords for better SEO and discoverability. Original: "${text}"

Return only the improved comma-separated tags, nothing else.`,

            default: `Improve and optimize this e-commerce content to be more professional and compelling: "${text}"

Return only the improved text, nothing else.`
        };

        const prompt = prompts[fieldType] || prompts.default;

        try {
            console.log('Optimizing text...');
            const response = await fetch(
                this.config.endpoints.generateContent,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.config.apiKey
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 512
                        }
                    })
                }
            );

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', JSON.stringify(errorData, null, 2));
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API response:', JSON.stringify(data, null, 2));

            // Extract text from response
            if (data.candidates && data.candidates[0]) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            const optimizedText = part.text.trim();
                            console.log('✓ Optimized text:', optimizedText);
                            return optimizedText;
                        }
                    }
                }
            }

            throw new Error('No optimized text found in response');
        } catch (error) {
            console.error('=== Gemini Optimization Error ===');
            console.error('Error:', error);
            throw error;
        }
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.GeminiService = new GeminiService();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiService;
}
