// src/components/Sidebar.jsx
import React from 'react';
// import './Sidebar.css'; // Optional: extract styles here

export default function Sidebar({ history, onSelect, onNewChat }) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full btn-primary mb-4 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <h3 className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Chats</h3>
        
        {history.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">No chat history yet</div>
        ) : (
          history.map((item, idx) => (
            <div 
              key={idx} 
              className="sidebar-chat-item" 
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  {item._id?.pdfId ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item._id?.pdfTitle || 'General Chat'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.chats?.[0]?.question.slice(0, 40)}...
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} AI Assistant
        </div>
      </div>
    </div>
  );
}
