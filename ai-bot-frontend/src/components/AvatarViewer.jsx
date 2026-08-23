import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { speakWithGoogleTTS } from '../utils/googleTTS';

const AvatarViewer = forwardRef((props, ref) => {
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    // Initialize communication with iframe
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'AVATAR_READY') {
        console.log('✅ Avatar is ready for communication');
        setIframeReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    speak: async (text) => {
      if (!text) return;
      
      try {
        // First try to use the 3D avatar's built-in speech system
        if (iframeReady && iframeRef.current && iframeRef.current.contentWindow) {
          console.log('Using 3D avatar speech');
          iframeRef.current.contentWindow.postMessage({ 
            type: 'SPEAK', 
            text 
          }, '*');
          // Don't use Google TTS as fallback - the avatar will handle it
        } else {
          // If avatar isn't ready, use Google TTS directly
          console.log('Using direct Google TTS (avatar not ready)');
          await speakWithGoogleTTS(text);
        }
      } catch (err) {
        console.error('Error sending speak command to avatar:', err);
        // Fallback to direct TTS
        await speakWithGoogleTTS(text);
      }
    }
  }));

  return (
    <div className="h-full w-full ml-[5rem] flex flex-col items-center justify-center">
      <iframe 
        ref={iframeRef}
        src="/avatar.html" 
        className="w-full h-full border-0" 
        style={{ minHeight: '500px' }} 
        title="3D Avatar" 
      />
    </div>
  );
});

AvatarViewer.displayName = 'AvatarViewer';

export default AvatarViewer;
