# Audio Transcription Backend

This project is a Node.js + Express backend that allows users to upload audio files and receive transcriptions using the OpenAI Whisper API.

## Project Structure

```
audio-transcription-backend
├── src
│   ├── app.js
│   └── routes
│       └── transcribe.js
├── uploads
├── .gitignore
├── package.json
└── README.md
```

## Instructions to Run the Server

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Create an `uploads` directory if it doesn't exist.
5. Start the server with `node src/app.js`.
6. Use a tool like Postman to send a POST request to the `/transcribe` endpoint with an audio file.

## API Endpoint

- **POST /transcribe**: Upload an audio file as `multipart/form-data` to receive a transcription.

## Dependencies

- `express`: Web framework for Node.js.
- `multer`: Middleware for handling `multipart/form-data`.
- `axios`: Promise-based HTTP client for the browser and Node.js.

## Error Handling

The server includes error handling for file uploads and API requests to ensure that users receive appropriate feedback in case of issues.