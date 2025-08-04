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

interface FileUploaderProps {
  onTranscriptionResult: (data: TranscriptionData) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onTranscriptionResult,
  onLoadingChange,
  isLoading
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 
    'audio/mp4', 'audio/webm', 'audio/flac', 'audio/ogg'
  ];

  const maxFileSize = 25 * 1024 * 1024; // 25MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    if (!supportedFormats.includes(file.type)) {
      alert('Please select a supported audio format (MP3, WAV, M4A, MP4, WEBM, FLAC, OGG)');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      alert('File size must be less than 25MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    onLoadingChange(true);
    
    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append('audio', selectedFile);

      // ==========================================
      // 🔧 API INTEGRATION NEEDED HERE
      // ==========================================
      // Replace the mock code below with actual API call to your backend
      // Backend endpoint: http://localhost:YOUR_PORT/api/transcribe
      // Method: POST
      // Body: FormData with 'audio' field containing the uploaded file
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

      console.log('📁 File ready for API:', selectedFile.name, formatFileSize(selectedFile.size));
      console.log('📡 Send this FormData to: http://localhost:YOUR_PORT/api/transcribe');

      // MOCK RESPONSE - Remove this when integrating real API
      setTimeout(() => {
        const mockResponse: TranscriptionData = {
          transcription: `This is a mock transcription of your uploaded file "${selectedFile.name}". The actual transcription will be provided by OpenAI Whisper API once the backend integration is complete. The file appears to contain clear audio content suitable for transcription.`,
          language: "en",
          duration: 45, // Mock duration
          originalFilename: selectedFile.name,
          emotion: "positive",
          tone: "professional",
          emotionReason: "The speaker demonstrates confidence and clarity in their delivery, indicating a positive and professional demeanor."
        };
        
        onTranscriptionResult(mockResponse);
        onLoadingChange(false);
      }, 3000);

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      onLoadingChange(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="component-card">
      <h2 className="text-white mb-4" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        📁 Upload Audio File
      </h2>
      
      <p className="text-white mb-6" style={{ opacity: 0.8, marginBottom: '2rem' }}>
        Upload an audio file to transcribe and analyze
      </p>

      {/* File Upload Area */}
      {!selectedFile && (
        <div
          className={`file-upload-area ${isDragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            📎
          </div>
          
          <p className="text-white" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            {isDragActive ? 'Drop the file here' : 'Drag & drop your audio file here'}
          </p>
          
          <p className="text-white" style={{ opacity: 0.7, marginBottom: '1rem' }}>
            or
          </p>
          
          <button className="secondary-button">
            📂 Browse Files
          </button>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.6, color: 'white' }}>
            <p>Supported formats: MP3, WAV, M4A, MP4, WEBM, FLAC, OGG</p>
            <p>Maximum file size: 25MB</p>
          </div>
        </div>
      )}

      {/* Selected File Info */}
      {selectedFile && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '15px', 
            padding: '20px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <span style={{ fontSize: '2rem' }}>🎵</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p className="text-white" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                  {selectedFile.name}
                </p>
                <p className="text-white" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Audio file'}
                </p>
              </div>
            </div>
          </div>

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
              onClick={clearFile}
              disabled={isLoading}
            >
              🗑️ Remove File
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ fontSize: '0.9rem', opacity: 0.7, color: 'white' }}>
        <p>💡 Tips:</p>
        <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Higher quality audio produces better transcriptions</li>
          <li>Clear speech without background noise works best</li>
          <li>Supported languages include English, Spanish, French, and many more</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
