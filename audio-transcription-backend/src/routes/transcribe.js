const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const audioFilePath = req.file.path;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioFilePath));
        formData.append('model', 'whisper-1');

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
            },
        });

        // Clean up the uploaded file
        fs.unlinkSync(audioFilePath);

        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while processing the audio file.' });
    }
});

module.exports = router;