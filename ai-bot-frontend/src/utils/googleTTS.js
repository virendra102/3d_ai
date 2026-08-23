export const speakWithGoogleTTS = async (text) => {
  // Using the same API key and endpoint from index.html
  const apiKey = 'AIzaSyBK4oXnKERs-ntHjiVlj5RYeJJvZH_m9n8'; 
  const url = `https://eu-texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

  const body = {
    input: { text },
    voice: {
      languageCode: "en-GB",
      name: "en-GB-Standard-A", // Using the same voice from index.html
    },
    audioConfig: {
      audioEncoding: "MP3"
    }
  };

  try {
    console.log("🔊 Calling Google TTS API...");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    if (data.audioContent) {
      console.log("✅ Google TTS audio data received, playing...");
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      // Ensure audio is loaded before playing
      return new Promise((resolve) => {
        audio.oncanplaythrough = () => {
          audio.play()
            .then(() => {
              console.log("✅ Audio playback started successfully");
              resolve(true);
            })
            .catch(err => {
              console.error("❌ Audio playback error:", err);
              resolve(false);
            });
        };
        
        audio.onerror = (err) => {
          console.error("❌ Audio loading error:", err);
          resolve(false);
        };
        
        // Fallback if the events don't fire
        setTimeout(() => {
          try {
            audio.play();
            console.log("✅ Audio playback started (fallback)");
            resolve(true);
          } catch (e) {
            console.error("❌ Audio fallback error:", e);
            resolve(false);
          }
        }, 500);
      });
    } else {
      console.warn("❌ TTS response missing audioContent:", data);
      return false;
    }
  } catch (err) {
    console.error("❌ Error using Google TTS:", err);
    return false;
  }
};

// This function attempts to use the TalkingHead library if available
export const speakWithTalkingHead = async (head, text) => {
  if (head && typeof head.speakText === 'function') {
    try {
      head.speakText(text);
      return true;
    } catch (err) {
      console.error("Error with TalkingHead TTS:", err);
      return false;
    }
  }
  return false;
};
  