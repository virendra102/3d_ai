import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import ChatInput from '../components/ChatInput';
import  AvatarViewer   from '../components/AvatarViewer.jsx';
import { speakWithGoogleTTS } from '../utils/googleTTS';
import { 
  askQuestion, 
  askPdfQuestion, 
  getAllChats, 
  uploadPdf, 
  saveChat,
  getChatHistory
} from '../api/api';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [currentPdfTitle, setCurrentPdfTitle] = useState(null);
  const avatarRef = useRef(null);

  // Fetch all chats on component mount
  useEffect(() => {
    fetchAllChats();
  }, []);

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const data = await getAllChats();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    try {
      // Skip processing empty text
      if (!text || !text.trim()) return;
      
      setLoading(true);
      
      // Add user message to chat immediately
      const newMessage = { question: text, answer: '' };
      const updatedChat = [...currentChat, newMessage];
      setCurrentChat(updatedChat);
      
      let response;
      
      if (currentPdfId) {
        // Ask question about PDF
        response = await askPdfQuestion(currentPdfId, text);
        
        // Save the chat
        await saveChat(currentPdfId, text, response.answer);
      } else {
        // Ask general question
        response = await askQuestion(text);
        
        // For general questions, we don't have a pdfId, but we still want to save the chat
        // The backend should handle this case appropriately
      }
      
      // Update the message with the AI response
      updatedChat[updatedChat.length - 1].answer = response.answer;
      setCurrentChat([...updatedChat]);
      
      // Make avatar speak
      if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
        avatarRef.current.speak(response.answer);
      }
            
      // Refresh all chats to show the new conversation
      fetchAllChats();
      
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      
      // Show error in chat
      const updatedChat = [...currentChat];
      updatedChat[updatedChat.length - 1].answer = 'Sorry, there was an error processing your request. Please try again.';
      setCurrentChat(updatedChat);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      
      // Upload the PDF
      const response = await uploadPdf(file);
      
      // Set the current PDF ID and title (filename)
      setCurrentPdfId(response.pdfId);
      setCurrentPdfTitle(file.name);
      
      // Clear current chat to start a new conversation with this PDF
      setCurrentChat([]);
      
      // Show confirmation message
      const confirmationMessage = `✅ PDF uploaded successfully. You can now ask questions about this document.`;
      setCurrentChat([
        { 
          question: `Uploaded: ${file.name}`, 
          answer: confirmationMessage
        }
      ]);
      
      // Make avatar speak the confirmation
      if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
        avatarRef.current.speak(confirmationMessage);
      }
      
      // Refresh all chats to show the new PDF
      fetchAllChats();
      
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      
      // Show error in chat
      const errorMessage = `❌ Error uploading PDF. Please try again.`;
      setCurrentChat([
        { 
          question: `Tried to upload: ${file.name}`, 
          answer: errorMessage
        }
      ]);
      
      // Make avatar speak the error
      if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
        avatarRef.current.speak(errorMessage);
      }
    }
  };

  const handleSelectChat = async (chatGroup) => {
    try {
      setLoading(true);
      
      // If it's a PDF chat, set the current PDF ID
      if (chatGroup._id?.pdfId) {
        setCurrentPdfId(chatGroup._id.pdfId);
        setCurrentPdfTitle(chatGroup._id.pdfTitle);
        
        // Get the full chat history for this PDF
        const history = await getChatHistory(chatGroup._id.pdfId);
        
        // Format the messages for the chat box
        const messages = history.history.map(item => ({
          question: item.question,
          answer: item.answer
        }));
        
        setCurrentChat(messages);
      } else {
        // If it's a general chat, just use the chats from the group
        setCurrentPdfId(null);
        setCurrentPdfTitle(null);
        setCurrentChat(chatGroup.chats);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error selecting chat:', error);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    // Clear current chat and PDF context
    setCurrentChat([]);
    setCurrentPdfId(null);
    setCurrentPdfTitle(null);
  };
  
  // const handleSaveChat = async () => {
  //   try {
  //     setLoading(true);
      
  //     if (currentPdfId) {
  //       // Show a message in chat that we're saving
  //       const updatedChat = [...currentChat, {
  //         question: "Saving chat...",
  //         answer: "Please wait while the conversation is being saved."
  //       }];
  //       setCurrentChat(updatedChat);
        
  //       // Call the save chat API
  //       const response = await saveChat(currentPdfId);
        
  //       if (response.success) {
  //         // Remove the "saving" message
  //         updatedChat.pop();
          
  //         // Add success message to chat
  //         updatedChat.push({
  //           question: "System",
  //           answer: "✅ Chat saved successfully!"
  //         });
  //         setCurrentChat([...updatedChat]);
          
  //         // Speak confirmation
  //         if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
  //           avatarRef.current.speak("Chat saved successfully!");
  //         }
          
  //         // Refresh all chats to show the new saved chat
  //         fetchAllChats();
  //       } else {
  //         // Remove the "saving" message
  //         updatedChat.pop();
          
  //         // Add error message to chat
  //         updatedChat.push({
  //           question: "System",
  //           answer: "❌ Failed to save chat. Please try again."
  //         });
  //         setCurrentChat([...updatedChat]);
          
  //         // Speak error
  //         if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
  //           avatarRef.current.speak("Failed to save chat. Please try again.");
  //         }
  //       }
  //     } else {
  //       // Show error in chat if no PDF is selected
  //       const updatedChat = [...currentChat, {
  //         question: "System",
  //         answer: "No PDF selected. Please upload a PDF document first."
  //       }];
  //       setCurrentChat(updatedChat);
        
  //       // Speak error
  //       if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
  //         avatarRef.current.speak("No PDF selected. Please upload a PDF document first.");
  //       }
  //     }
      
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Save chat error:", error);
      
  //     // Add error message to chat
  //     const updatedChat = [...currentChat, {
  //       question: "System Error",
  //       answer: "❌ Error saving chat: " + (error.message || "Unknown error")
  //     }];
  //     setCurrentChat(updatedChat);
      
  //     // Speak error
  //     if (avatarRef.current && typeof avatarRef.current.speak === 'function') {
  //       avatarRef.current.speak("Error saving chat. Please try again.");
  //     }
      
  //     setLoading(false);
  //   }
  // };
  const handleSaveChat = async () => {
    try {
      setLoading(true);
  
      // Show a "saving..." message
      const updatedChat = [...currentChat, {
        question: "Saving chat...",
        answer: "Please wait while the conversation is being saved."
      }];
      setCurrentChat(updatedChat);
  
      let success = false;
  
      // Save chat entries one by one
      for (const entry of currentChat) {
        const { question, answer } = entry;
        if (question && answer) {
          const res = await saveChat(currentPdfId || null, question, answer);
          if (res?.success) success = true;
        }
      }
  
      // Remove the "saving" message
      updatedChat.pop();
  
      // Add confirmation or error message
      updatedChat.push({
        question: "System",
        answer: success
          ? "✅ Chat saved successfully!"
          : "❌ Failed to save chat. Please try again."
      });
  
      setCurrentChat([...updatedChat]);
  
      // Speak it out
      if (avatarRef.current?.speak) {
        avatarRef.current.speak(success
          ? "Chat saved successfully!"
          : "Failed to save chat. Please try again.");
      }
  
      // Refresh all chats if saved
      if (success) fetchAllChats();
  
      setLoading(false);
    } catch (error) {
      console.error("Save chat error:", error);
  
      const updatedChat = [...currentChat, {
        question: "System Error",
        answer: "❌ Error saving chat: " + (error.message || "Unknown error")
      }];
      setCurrentChat(updatedChat);
  
      if (avatarRef.current?.speak) {
        avatarRef.current.speak("Error saving chat. Please try again.");
      }
  
      setLoading(false);
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Sidebar 
        history={chats} 
        onSelect={handleSelectChat} 
        onNewChat={handleNewChat}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Centered Avatar */}
        <div className="md:w-2/3 w-full h-[calc(100vh-140px)] md:h-full flex items-center justify-center p-2 avatar-container">
          <div className="w-full h-full">
            <AvatarViewer ref={avatarRef} />
          </div>
        </div>
        
        {/* Chat Area on the Right */}
        <div className="md:w-3/3 w-full ml-[10rem] flex flex-col overflow-hidden border-l border-gray-200">
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={currentChat} loading={loading} />
          </div>
          <div className="flex flex-col w-full">
            <ChatInput 
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              loading={loading}
              currentPdfId={currentPdfId}
            />
            
            {/* Save Chat Button */}
            <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end">
              <label
                onClick={handleSaveChat}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                disabled={loading || !currentPdfId}
              >
                💾 Save Chat
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
