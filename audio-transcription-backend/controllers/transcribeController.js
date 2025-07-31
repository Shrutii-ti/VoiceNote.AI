const fs = require('fs');
const path = require('path');
const whisperService = require('../services/whisperService');
const emotionAnalysisService = require('../services/emotionAnalysisService');

/**
 * Transcribe audio file using OpenAI Whisper API and analyze emotion/tone
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const transcribeAudio = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No audio file provided',
                message: 'Please upload an audio file'
            });
        }

        const audioFilePath = req.file.path;
        const originalFilename = req.file.originalname;

        console.log(`🎵 Processing audio file: ${originalFilename}`);

        // Call Whisper service to transcribe audio
        const transcription = await whisperService.transcribeAudio(audioFilePath);
        console.log(`📝 Transcription completed: "${transcription.text}"`);

        // Analyze emotion and tone from the transcription
        let emotionAnalysis = null;
        try {
            console.log(`🧠 Starting emotion analysis...`);
            emotionAnalysis = await emotionAnalysisService.analyzeEmotionAndTone(transcription.text);
            console.log(`✅ Emotion analysis completed: ${emotionAnalysis.emotion}, ${emotionAnalysis.tone}`);
        } catch (emotionError) {
            console.warn(`⚠️ Emotion analysis failed: ${emotionError.message}`);
            // Continue without emotion analysis if it fails
            emotionAnalysis = {
                emotion: 'unknown',
                tone: 'unknown',
                reason: 'Emotion analysis was not available'
            };
        }

        // Clean up the uploaded file
        try {
            fs.unlinkSync(audioFilePath);
            console.log(`🗑️ Cleaned up temporary file: ${audioFilePath}`);
        } catch (cleanupError) {
            console.warn(`⚠️ Failed to clean up file ${audioFilePath}:`, cleanupError.message);
        }

        // Prepare response data
        const responseData = {
            transcription: transcription.text,
            language: transcription.language,
            duration: transcription.duration,
            originalFilename: originalFilename,
            emotion: emotionAnalysis.emotion,
            tone: emotionAnalysis.tone,
            emotionReason: emotionAnalysis.reason
        };

        console.log(`📤 Sending response with emotion analysis:`, responseData);

        // Return successful response with transcription and emotion analysis
        res.status(200).json({
            success: true,
            message: 'Audio transcribed and analyzed successfully',
            data: responseData
        });

    } catch (error) {
        console.error('❌ Transcription error:', error);

        // Clean up file in case of error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
                console.log(`🗑️ Cleaned up file after error: ${req.file.path}`);
            } catch (cleanupError) {
                console.warn(`⚠️ Failed to clean up file after error:`, cleanupError.message);
            }
        }

        // Handle specific error types
        if (error.code === 'ENOENT') {
            return res.status(500).json({
                error: 'File processing error',
                message: 'Unable to process the uploaded file'
            });
        }

        if (error.response && error.response.status === 401) {
            return res.status(500).json({
                error: 'API authentication error',
                message: 'Invalid OpenAI API key. Please check your configuration.'
            });
        }

        if (error.response && error.response.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Too many requests to OpenAI API. Please try again later.'
            });
        }

        // Generic error response
        res.status(500).json({
            error: 'Transcription failed',
            message: 'An error occurred while transcribing the audio file'
        });
    }
};

module.exports = {
    transcribeAudio
}; 