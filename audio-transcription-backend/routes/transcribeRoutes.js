const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controller
const transcribeController = require('../controllers/transcribeController');

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
router.post('/audio', upload.single('audio'), transcribeController.transcribeAudio);

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