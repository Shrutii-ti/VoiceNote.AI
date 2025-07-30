const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Service for handling OpenAI Whisper API interactions
 */
class WhisperService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
        
        if (!this.apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
    }

    /**
     * Transcribe audio file using OpenAI Whisper API
     * @param {string} audioFilePath - Path to the audio file
     * @returns {Promise<Object>} Transcription result
     */
    async transcribeAudio(audioFilePath) {
        try {
            // Check if file exists
            if (!fs.existsSync(audioFilePath)) {
                throw new Error(`Audio file not found: ${audioFilePath}`);
            }

            // Create form data for the API request
            const formData = new FormData();
            formData.append('file', fs.createReadStream(audioFilePath));
            formData.append('model', 'whisper-1');
            formData.append('response_format', 'verbose_json');

            console.log(`🔊 Sending audio to OpenAI Whisper API...`);

            // Make API request
            const response = await axios.post(this.apiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: 60000, // 60 second timeout
            });

            console.log(`✅ Transcription completed successfully`);

            // Return formatted response
            return {
                text: response.data.text,
                language: response.data.language,
                duration: response.data.duration,
                segments: response.data.segments || [],
                task: response.data.task
            };

        } catch (error) {
            console.error('❌ Whisper API error:', error.message);

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
                    case 413:
                        throw new Error('Audio file is too large. Please use a smaller file.');
                    default:
                        throw new Error(`API error (${status}): ${data.error?.message || 'Unknown error'}`);
                }
            }

            // Handle network/timeout errors
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. The audio file might be too large or the API is slow to respond.');
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

module.exports = new WhisperService(); 