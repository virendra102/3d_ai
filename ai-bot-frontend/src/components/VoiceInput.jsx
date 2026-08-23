// import React, { useState, useEffect, useCallback, useRef } from 'react';

// export default function VoiceInput({ onTranscript, disabled }) {
//   const [listening, setListening] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [silenceTimer, setSilenceTimer] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [speechDetected, setSpeechDetected] = useState(false);
//   const lastSpeechTime = useRef(0);
//   const SILENCE_DURATION = 2000; // 2 seconds of silence before sending

//   // Initialize speech recognition
//   useEffect(() => {
//     if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
//       console.error("Speech recognition not supported in this browser");
//       return;
//     }

//     const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.continuous = true;
//     recognitionInstance.interimResults = true;
//     recognitionInstance.lang = "en-US";

//     recognitionInstance.onstart = () => {
//       console.log("🎤 Speech recognition started...");
//       setListening(true);
//       setTranscript("Listening...");
//       setSpeechDetected(false);
//       lastSpeechTime.current = 0;
//       onTranscript("Listening...", false);
//     };

//     recognitionInstance.onresult = (event) => {
//       // Clear any existing silence timer
//       if (silenceTimer) clearTimeout(silenceTimer);
      
//       // Get the transcript
//       let currentTranscript = "";
//       for (let i = 0; i < event.results.length; i++) {
//         currentTranscript += event.results[i][0].transcript + " ";
//       }
      
//       currentTranscript = currentTranscript.trim();
      
//       // Only update if we have actual words (not just "Listening...")
//       if (currentTranscript && currentTranscript !== "Listening...") {
//         setTranscript(currentTranscript);
//         onTranscript(currentTranscript, false);
//         setSpeechDetected(true);
//         lastSpeechTime.current = Date.now();
//       }
      
//       // Start silence detection timer - send the transcript after 2 seconds of silence
//       const timer = setTimeout(() => {
//         console.log("Silence detected for 2 seconds, stopping recognition...");
        
//         // Only send if we have meaningful content
//         if (speechDetected && currentTranscript && currentTranscript !== "Listening...") {
//           console.log("Auto-sending transcript after silence:", currentTranscript);
//           // Send the final transcript
//           onTranscript(currentTranscript, true);
//         }
        
//         // Stop the recognition
//         if (recognitionInstance) {
//           recognitionInstance.stop();
//         }
//       }, SILENCE_DURATION);
      
//       setSilenceTimer(timer);
//     };

//     recognitionInstance.onaudioend = () => {
//       console.log("Audio input ended");
//     };

//     recognitionInstance.onspeechend = () => {
//       console.log("Speech ended");
//     };

//     recognitionInstance.onerror = (event) => {
//       console.error("Speech error", event.error);
//     };

//     recognitionInstance.onend = () => {
//       setListening(false);
      
//       // Clear silence timer if it exists
//       if (silenceTimer) {
//         clearTimeout(silenceTimer);
//         setSilenceTimer(null);
//       }
      
//       // We don't need to send the transcript here anymore
//       // because we're already sending it in the silence timer
//       console.log("Speech recognition ended");
//     };

//     setRecognition(recognitionInstance);

//     // Cleanup on unmount
//     return () => {
//       if (recognitionInstance) {
//         try {
//           recognitionInstance.stop();
//         } catch (e) {
//           // Ignore errors when stopping
//         }
//       }
//       if (silenceTimer) {
//         clearTimeout(silenceTimer);
//       }
//     };
//   }, []);

//   const toggleListening = useCallback(() => {
//     if (disabled) return;
    
//     if (listening) {
//       if (recognition) {
//         recognition.stop();
//       }
//     } else {
//       if (recognition) {
//         recognition.start();
//       }
//     }
//   }, [disabled, listening, recognition]);

//   return (
//     <div
//       onClick={toggleListening}
//       className={`p-2 cursor-pointer ${listening ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
//       title={listening ? "Stop listening" : "Start voice input"}
//     >
//       {listening ? (
//         <div className="flex items-center justify-center">
//           <div className="flex space-x-1 mr-1">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
//           </div>
//           <span>🎙 Listening...</span>
//         </div>
//       ) : (
//         <span>🎤 Speak</span>
//       )}
//     </div>
//   );
// } 

import React, { useState, useRef } from 'react';

export default function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const startRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    finalTranscriptRef.current = "";

    recognition.onstart = () => {
      setListening(true);
      onTranscript("Listening...", false);
    };

    recognition.onresult = (event) => {
      clearTimeout(silenceTimerRef.current);

      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }

      fullTranscript = fullTranscript.trim();
      finalTranscriptRef.current = fullTranscript;

      if (fullTranscript && fullTranscript !== "Listening...") {
        onTranscript(fullTranscript, false);

        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      const finalText = finalTranscriptRef.current;
      if (finalText && finalText !== "Listening...") {
        onTranscript(finalText, true); // ← this will auto-send it
      }
    };

    recognition.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearTimeout(silenceTimerRef.current);
    setListening(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (listening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`p-2 cursor-pointer ${listening ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg hover:opacity-90 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={listening ? "Stop listening" : "Start voice input"}
    >
      {listening ? (
        <div className="flex items-center justify-center">
          <div className="flex space-x-1 mr-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>🎙 Listening...</span>
        </div>
      ) : (
        <span>🎤 Speak</span>
      )}
    </div>
  );
}
