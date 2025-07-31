const axios = require('axios');

/**
 * Service for analyzing emotion and tone using OpenAI GPT-4o mini
 */
class EmotionAnalysisService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        if (!this.apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
    }

    /**
     * Analyze emotion and tone from transcribed text
     * @param {string} transcription - The transcribed text to analyze
     * @returns {Promise<Object>} Emotion and tone analysis result
     */
    async analyzeEmotionAndTone(transcription) {
        try {
            const prompt = `
You are an assistant for an AI audio transcription and emotion detection app.

The audio was transcribed as:
"${transcription}"

Your job is to analyze this transcript and detect:
1. The main **emotion** being expressed (e.g., angry, happy, sad, fearful, surprised, neutral, excited, frustrated, anxious, etc.)
2. The **tone of voice** (e.g., serious, sarcastic, casual, excited, polite, aggressive, formal, friendly, nervous, confident, etc.)
3. A short and clear **reason** justifying your detection based on the text.

⚠️ Important: Reply ONLY in the following JSON format. No explanation outside the JSON.

{
  "emotion": "<detected emotion>",
  "tone": "<detected tone>",
  "reason": "<one sentence explanation>"
}
`;

            console.log(`🧠 Analyzing emotion and tone for transcription...`);

            const response = await axios.post(this.apiUrl, {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 150
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000, // 30 second timeout
            });

            console.log(`✅ Emotion analysis completed successfully`);

            // Parse the JSON response from GPT
            const analysisText = response.data.choices[0].message.content.trim();
            let analysis;
            
            try {
                // Try to parse the JSON response
                analysis = JSON.parse(analysisText);
            } catch (parseError) {
                console.warn('⚠️ Failed to parse GPT response as JSON, using fallback');
                // Fallback analysis if JSON parsing fails
                analysis = {
                    emotion: 'neutral',
                    tone: 'neutral',
                    reason: 'Unable to determine specific emotion or tone from the transcription'
                };
            }

            return {
                emotion: analysis.emotion || 'neutral',
                tone: analysis.tone || 'neutral',
                reason: analysis.reason || 'Analysis completed but specific details unavailable'
            };

        } catch (error) {
            console.error('❌ Emotion analysis error:', error.message);

            // Handle specific API errors
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 401:
                        throw new Error('Invalid OpenAI API key. Please check your configuration.');
                    case 429:
                        throw new Error('Rate limit exceeded. Please try again later.');
                    case 400:
                        throw new Error(`API request failed: ${data.error?.message || 'Invalid request'}`);
                    default:
                        throw new Error(`API error (${status}): ${data.error?.message || 'Unknown error'}`);
                }
            }

            // Handle network/timeout errors
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. The API is slow to respond.');
            }

            if (error.code === 'ENOTFOUND') {
                throw new Error('Network error. Please check your internet connection.');
            }

            // Re-throw other errors
            throw error;
        }
    }

    /**
     * Validate API key format (basic check)
     * @returns {boolean}
     */
    validateApiKey() {
        return this.apiKey && this.apiKey.startsWith('sk-') && this.apiKey.length > 20;
    }

    /**
     * Get API status (for health checks)
     * @returns {Promise<Object>}
     */
    async getApiStatus() {
        try {
            const response = await axios.get('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: 10000,
            });
            
            return {
                status: 'connected',
                models: response.data.data.length,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = new EmotionAnalysisService(); 