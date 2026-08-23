import React, { useState, useRef, useEffect } from 'react';
import VoiceInput from './VoiceInput';

export default function ChatInput({ onSendMessage, onFileUpload, loading, currentPdfId }) {
  const [input, setInput] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Handle manual text input submission
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  // Handle voice transcript updates
  const handleVoiceTranscript = (transcript, isFinal) => {
    // If this is just a partial transcript, update the input field and show voice active state
    if (!isFinal) {
      setVoiceActive(true);
      setInput(transcript);
    } 
    // If this is the final transcript, send the message and reset
    else if (transcript.trim() && transcript !== "Listening...") {
      onSendMessage(transcript);
      setInput("");
      setVoiceActive(false);
    } else {
      setVoiceActive(false);
    }
  };

  // Show a visual pulse when voice is active
  useEffect(() => {
    if (voiceActive && inputRef.current) {
      inputRef.current.classList.add('voice-active-pulse');
    } else if (inputRef.current) {
      inputRef.current.classList.remove('voice-active-pulse');
    }
  }, [voiceActive]);

  return (
    <div className="p-4 border-t bg-gray-50 flex flex-col space-y-2">
      {/* Voice activity indicator */}
      {voiceActive && (
        <div className="flex items-center bg-green-100 py-1 px-3 rounded-full text-sm text-green-700 mb-2 self-start">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span>Voice active - I'm listening...</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={currentPdfId 
            ? "Ask about the PDF or FAQ (SSIT COLLEGE)" 
            : "Type a question or click on speak button"}
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        
        <input 
          type="file" 
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
          id="pdf-upload"
          ref={fileInputRef}
        />
        
        <label
          htmlFor="pdf-upload"
          className="btn-upload flex-shrink-0"
          title="Upload PDF"
        >
          📄 Upload
        </label>

        <label
          onClick={handleSend}
          className="btn-send flex-shrink-0"
          disabled={loading || !input.trim()}
        >
          Send
        </label>

        {/* Voice Input Button */}
        <VoiceInput 
          onTranscript={handleVoiceTranscript}
          disabled={loading}
        />
      </div>
    </div>
  );
}
