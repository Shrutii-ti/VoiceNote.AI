const mongoose = require('mongoose');

const TranscriptionRecordSchema = new mongoose.Schema({
  transcription: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true },
  originalFilename: { type: String, required: true },
  emotion: { type: String, required: true },
  tone: { type: String, required: true },
  emotionReason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TranscriptionRecord', TranscriptionRecordSchema);