const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Import controller
const transcribeController = require('../controllers/transcribeController');
const TranscriptionRecord = require('../models/TranscriptionRecord');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `audio-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only audio files are allowed.'), false);
        }
    },
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit
    }
});

// Route for audio transcription
router.post('/audio', upload.single('audio'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded.' });
        }

        // 1. Transcribe audio with Whisper
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'verbose_json'); // <-- Add this line

        const openaiRes = await axios.post(
            'https://api.openai.com/v1/audio/transcriptions',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const transcription = openaiRes.data.text;
        const language = openaiRes.data.language || 'unknown';

        // 2. Get duration (dummy value, replace with real duration if needed)
        const duration = 0;

        // 3. Analyze tone/emotion with GPT-4o
        let emotion = 'unknown';
        let tone = 'unknown';
        let emotionReason = 'unknown';

        try {
            const gptPrompt = `
Given the following transcription, analyze and return:
- The overall emotion (e.g. happy, sad, angry, neutral, excited, etc.)
- The overall tone (e.g. formal, informal, friendly, serious, etc.)
- A brief reason for your emotion classification.

Respond in this JSON format:
{
  "emotion": "...",
  "tone": "...",
  "emotionReason": "..."
}

Transcription:
"""${transcription}"""
            `.trim();

            const gptRes = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are an expert at analyzing tone and emotion in text.' },
                        { role: 'user', content: gptPrompt }
                    ],
                    temperature: 0.2
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Try to parse the JSON from GPT's response
            const gptText = gptRes.data.choices[0].message.content;
            const match = gptText.match(/\{[\s\S]*\}/);
            if (match) {
                const gptJson = JSON.parse(match[0]);
                emotion = gptJson.emotion || emotion;
                tone = gptJson.tone || tone;
                emotionReason = gptJson.emotionReason || emotionReason;
            }
        } catch (gptErr) {
            console.error('GPT-4o emotion/tone analysis failed:', gptErr.message);
            // fallback values already set
        }

        // 4. Save to MongoDB
        const recordData = {
            transcription,
            language,
            duration,
            originalFilename: req.file.originalname,
            emotion,
            tone,
            emotionReason,
            createdAt: new Date()
        };

        try {
            await TranscriptionRecord.create(recordData);
        } catch (dbErr) {
            console.error('Error saving transcription record:', dbErr);
            return res.status(500).json({ error: 'Failed to save transcription record', details: dbErr.message });
        }

        res.json(recordData);

    } catch (err) {
        next(err);
    } finally {
        // Clean up uploaded file
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
    }
});

// Error handling for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'File size must be less than 25MB'
            });
        }
        return res.status(400).json({
            error: 'File upload error',
            message: error.message
        });
    }
    
    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            error: 'Invalid file type',
            message: 'Only audio files (MP3, WAV, M4A, OGG) are allowed'
        });
    }
    
    next(error);
});

module.exports = router;