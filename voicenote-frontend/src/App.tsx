import React, { useState } from 'react';
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import FileUploader from './components/FileUploader';
import TranscriptionResult from './components/TranscriptionResult';

interface TranscriptionData {
  transcription: string;
  language: string;
  duration: number;
  originalFilename: string;
  emotion: string;
  tone: string;
  emotionReason: string;
}

function App() {
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');

  const handleTranscriptionResult = (data: TranscriptionData) => {
    setTranscriptionData(data);
  };

  const handleLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const clearResults = () => {
    setTranscriptionData(null);
  };

  return (
    <div className="App">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              🎵 VoiceNote.AI
            </h1>
            <p className="app-subtitle">
              Transform your voice into intelligent notes with emotion analysis
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'record' ? 'active' : ''}`}
              onClick={() => setActiveTab('record')}
            >
              🎤 Record Audio
            </button>
            <button 
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📁 Upload File
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {activeTab === 'record' ? (
              <AudioRecorder 
                onTranscriptionResult={handleTranscriptionResult}
                onLoadingChange={handleLoadingState}
                isLoading={isLoading}
              />
            ) : (
              <FileUploader 
                onTranscriptionResult={handleTranscriptionResult}
                onLoadingChange={handleLoadingState}
                isLoading={isLoading}
              />
            )}

            {/* Results */}
            {transcriptionData && !isLoading && (
              <TranscriptionResult 
                data={transcriptionData}
                onClear={clearResults}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Powered by OpenAI Whisper & GPT-4o-mini</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
