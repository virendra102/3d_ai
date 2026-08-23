import React from 'react';

export default function AvatarFallback({ speaking }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-800 rounded-lg p-4">
      <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mb-4 relative overflow-hidden flex items-center justify-center">
        {/* Simple face */}
        <div className="absolute">
          <div className="flex space-x-4 mb-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          {speaking ? (
            <div className="w-6 h-2 bg-white rounded-full mx-auto animate-pulse"></div>
          ) : (
            <div className="w-4 h-1 bg-white rounded-full mx-auto mt-2"></div>
          )}
        </div>
      </div>
      
      {/* Speech indicator */}
      {speaking && (
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      
      <p className="text-white text-sm mt-2">
        {speaking ? "Speaking..." : "AI Assistant"}
      </p>
    </div>
  );
} 