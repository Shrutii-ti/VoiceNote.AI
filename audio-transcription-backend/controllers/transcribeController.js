const fs = require('fs');
const path = require('path');
const whisperService = require('../services/whisperService');

/**
 * Transcribe audio file using OpenAI Whisper API
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

        // Clean up the uploaded file
        try {
            fs.unlinkSync(audioFilePath);
            console.log(`🗑️ Cleaned up temporary file: ${audioFilePath}`);
        } catch (cleanupError) {
            console.warn(`⚠️ Failed to clean up file ${audioFilePath}:`, cleanupError.message);
        }

        // Return successful response
        res.status(200).json({
            success: true,
            message: 'Audio transcribed successfully',
            data: {
                transcription: transcription.text,
                language: transcription.language,
                duration: transcription.duration,
                originalFilename: originalFilename
            }
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