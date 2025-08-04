import React, { useState, useRef } from 'react';

interface TranscriptionData {
  transcription: string;
  language: string;
  duration: number;
  originalFilename: string;
  emotion: string;
  tone: string;
  emotionReason: string;
}

interface AudioRecorderProps {
  onTranscriptionResult: (data: TranscriptionData) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionResult,
  onLoadingChange,
  isLoading
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = async () => {
    if (!audioUrl) return;

    onLoadingChange(true);
    
    try {
      // Convert blob URL to actual file
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

      // Create FormData for API call
      const formData = new FormData();
      formData.append('audio', audioFile);

      // ==========================================
      // 🔧 API INTEGRATION NEEDED HERE
      // ==========================================
      // Replace the mock code below with actual API call to your backend
      // Backend endpoint: http://localhost:YOUR_PORT/api/transcribe
      // Method: POST
      // Body: FormData with 'audio' field containing the audio file
      // 
      // Example API call:
      // const apiResponse = await fetch('http://localhost:5000/api/transcribe', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await apiResponse.json();
      // onTranscriptionResult(result.data);
      // onLoadingChange(false);
      // ==========================================

      console.log('🎵 Audio file ready for API:', audioFile.name, audioFile.size);
      console.log('📡 Send this FormData to: http://localhost:YOUR_PORT/api/transcribe');

      // MOCK RESPONSE - Remove this when integrating real API
      setTimeout(() => {
        const mockResponse: TranscriptionData = {
          transcription: "This is a mock transcription of your recorded audio. The actual transcription will be provided by OpenAI Whisper API once the backend integration is complete.",
          language: "en",
          duration: recordingTime,
          originalFilename: "recording.wav",
          emotion: "neutral",
          tone: "casual",
          emotionReason: "The speaker appears calm and neutral based on the content and delivery."
        };
        
        onTranscriptionResult(mockResponse);
        onLoadingChange(false);
      }, 2000);

    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Error transcribing audio. Please try again.');
      onLoadingChange(false);
    }
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="component-card">
      <h2 className="text-white mb-4" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        🎤 Record Audio
      </h2>
      
      <p className="text-white mb-6" style={{ opacity: 0.8, marginBottom: '2rem' }}>
        Click the microphone to start recording your voice
      </p>

      {/* Recording Controls */}
      <div style={{ marginBottom: '2rem' }}>
        {!isRecording && !audioUrl && (
          <button 
            className="primary-button"
            onClick={startRecording}
            disabled={isLoading}
          >
            🎤 Start Recording
          </button>
        )}

        {isRecording && (
          <div>
            <div className="recording-animation">
              <div className="recording-dot"></div>
              <div className="recording-dot"></div>
              <div className="recording-dot"></div>
            </div>
            <p className="text-white mb-4" style={{ fontSize: '1.2rem' }}>
              Recording... {formatTime(recordingTime)}
            </p>
            <button 
              className="secondary-button"
              onClick={stopRecording}
            >
              ⏹️ Stop Recording
            </button>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div>
            <p className="text-white mb-4">
              ✅ Recording completed ({formatTime(recordingTime)})
            </p>
            
            <audio 
              controls 
              src={audioUrl}
              style={{ 
                marginBottom: '1rem',
                filter: 'invert(1)',
                opacity: 0.8
              }}
            />
            
            <div>
              <button 
                className="primary-button"
                onClick={handleTranscribe}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  '🔄 Transcribe & Analyze'
                )}
              </button>
              
              <button 
                className="secondary-button"
                onClick={clearRecording}
                disabled={isLoading}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ fontSize: '0.9rem', opacity: 0.7, color: 'white' }}>
        <p>💡 Tips:</p>
        <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Speak clearly and at a normal pace</li>
          <li>Ensure you're in a quiet environment</li>
          <li>Keep recordings under 25MB for best results</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioRecorder;
