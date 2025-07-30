# Voice-to-Notes AI Backend

A clean, well-structured Node.js + Express backend for a Voice-to-Notes AI application using OpenAI Whisper API for audio transcription.

## 🚀 Features

- **Audio Transcription**: Convert audio files to text using OpenAI Whisper API
- **File Upload**: Secure file upload with validation and size limits
- **Modular Architecture**: Clean separation of routes, controllers, and services
- **Error Handling**: Comprehensive error handling and logging
- **Development Logging**: Morgan logging in development mode
- **Environment Configuration**: Secure environment variable management

## 📁 Project Structure

```
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (not in git)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── uploads/                # Temporary audio file storage
├── routes/
│   └── transcribeRoutes.js # API routes for transcription
├── controllers/
│   └── transcribeController.js # Business logic handlers
├── services/
│   └── whisperService.js   # OpenAI Whisper API integration
└── utils/
    └── helpers.js          # Utility functions
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-notes-ai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

4. **Start the server**
   ```bash
   # Development mode (with logging)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

### File Upload Limits

- **Maximum file size**: 25MB
- **Supported formats**: MP3, WAV, M4A, OGG
- **Storage**: Temporary files in `uploads/` directory

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime information.

### Audio Transcription
```
POST /api/transcribe/audio
```
Upload an audio file for transcription.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `audio` file field

**Response:**
```json
{
  "success": true,
  "message": "Audio transcribed successfully",
  "data": {
    "transcription": "The transcribed text...",
    "language": "en",
    "duration": 10.5,
    "originalFilename": "audio.mp3"
  }
}
```

## 🧪 Testing

You can test the API using tools like Postman or curl:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test transcription endpoint
curl -X POST \
  -F "audio=@path/to/your/audio.mp3" \
  http://localhost:3000/api/transcribe/audio
```

## 🔍 Error Handling

The API provides detailed error responses for various scenarios:

- **400**: Invalid file type, file too large, missing file
- **401**: Invalid OpenAI API key
- **429**: Rate limit exceeded
- **500**: Server errors, API errors

## 🛡️ Security Features

- File type validation
- File size limits
- Temporary file cleanup
- Environment variable protection
- Input sanitization

## 📝 Logging

In development mode, the server logs:
- HTTP requests (Morgan)
- File processing status
- API calls to OpenAI
- Error details

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are configured
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "voice-notes-backend"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the error logs
2. Verify your OpenAI API key
3. Ensure file format is supported
4. Check file size limits 