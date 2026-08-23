import React, { useEffect, useRef } from 'react';

export default function ModelViewer({ src }) {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Add the model-viewer script to the page if it's not already there
    if (!scriptLoaded.current && !document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.type = 'module';
      document.body.appendChild(script);
      
      script.onload = () => {
        scriptLoaded.current = true;
        console.log('Model viewer script loaded successfully');
        // Create a model-viewer element once the script is loaded
        createModelViewer();
      };
      
      script.onerror = (err) => {
        console.error('Error loading model-viewer script:', err);
        showFallbackContent("Failed to load 3D viewer library");
      };
    } else if (scriptLoaded.current) {
      // If script is already loaded, just create the model-viewer
      createModelViewer();
    }
    
    function createModelViewer() {
      if (containerRef.current) {
        // Clear previous contents
        containerRef.current.innerHTML = '';
        
        // Create model-viewer element if it exists in the global scope
        if (typeof window.customElements !== 'undefined' && 
            window.customElements.get('model-viewer')) {
          
          const modelViewer = document.createElement('model-viewer');
          modelViewer.src = src;
          modelViewer.alt = "3D Avatar Model";
          modelViewer.autoRotate = true;
          modelViewer.cameraControls = true;
          modelViewer.autoRotateDelay = 1000;
          modelViewer.backgroundColor = "#f5eefe";
          modelViewer.style.width = '100%';
          modelViewer.style.height = '100%';
          modelViewer.style.borderRadius = '8px';
          modelViewer.exposure = 0.7;
          modelViewer.shadowIntensity = 1;
          modelViewer.environmentImage = "neutral";
          modelViewer.shadowSoftness = 1;
          modelViewer.cameraOrbit = "0deg 75deg 1.5m";
          modelViewer.minCameraOrbit = "auto auto 1m";
          modelViewer.maxCameraOrbit = "auto auto 2m";
          
          // Add error handling
          modelViewer.addEventListener('error', () => {
            console.error('Error loading 3D model:', src);
            showFallbackContent("Failed to load 3D model");
          });
          
          containerRef.current.appendChild(modelViewer);
          console.log('Model viewer element created');
        } else {
          console.warn('model-viewer custom element not available');
          showFallbackContent("3D viewer not supported in your browser");
        }
      }
    }
    
    function showFallbackContent(errorMessage) {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full text-center p-4">
            <img src="/avatar.svg" alt="AI Avatar" class="w-32 h-32 mb-4" />
            <p class="text-sm text-gray-700 mb-2">${errorMessage}</p>
            <a href="/view-model.html" target="_blank" class="text-xs text-purple-600 hover:underline">
              Try external 3D viewer
            </a>
          </div>
        `;
      }
    }
    
    // Cleanup
    return () => {
      // We don't remove the script as other instances might need it
    };
  }, [src]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-purple-50 to-indigo-50">
      {/* Model viewer will be injected here */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="animate-pulse text-purple-600 mb-2">Loading 3D model...</div>
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 