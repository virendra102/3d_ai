// src/components/ChatBox.jsx
import React, { useEffect, useRef } from 'react';

export default function ChatBox({ messages, loading }) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500">
            Start a conversation by asking a question or uploading a college-related PDF.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full  flex flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto  p-4 max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-140px)]">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="chat-bubble-user max-w-[80%]">
                <p className="text-gray-800">{msg.question}</p>
              </div>
            </div>
            
            <div className="flex items-start mt-2">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
              </div>
              <div className="chat-bubble-ai max-w-[80%]">
                <p className="text-gray-800 whitespace-pre-wrap">{msg.answer}</p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center space-x-2 p-4 rounded-lg bg-gray-50 w-fit mb-4">
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-gray-500 text-sm">AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
