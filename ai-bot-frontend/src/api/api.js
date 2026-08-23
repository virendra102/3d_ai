import axios from 'axios';

// Base URL for API calls
const BASE_URL = 'http://localhost:5000';

// Create axios instance with common config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat related API functions
export const askQuestion = async (text) => {
  try {
    const response = await api.post('/ask', { text });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};

// PDF related API functions
export const uploadPdf = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    
    const response = await axios.post(`${BASE_URL}/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

export const askPdfQuestion = async (pdfId, question) => {
  try {
    const response = await api.post('/ask-pdf', { pdfId, question });
    return response.data;
  } catch (error) {
    console.error('Error asking PDF question:', error);
    throw error;
  }
};

// This function is used in two ways:
// 1. To save a specific chat message when question and answer are provided
// 2. To save all chat history when only pdfId is provided (save button)
// export const saveChat = async (pdfId, question, answer) => {
//   try {
//     // If we have all parameters, save a specific chat entry
//     if (pdfId && question && answer) {
//       const response = await api.post('/save-chat', { 
//         pdfId, 
//         question, 
//         answer 
//       });
//       return response.data;
//     } 
//     // Otherwise, just send pdfId for the "save all" functionality
//     else if (pdfId) {
//       // This endpoint requires question and answer
//       // Since we don't have them, we'll create a special save marker
//       const response = await api.post('/save-chat', { 
//         pdfId, 
//         question: "🔖 Chat saved", 
//         answer: "The user saved this chat session at " + new Date().toLocaleString() 
//       });
//       return { ...response.data, success: true };
//     }
//     throw new Error('Invalid parameters for saveChat');
//   } catch (error) {
//     console.error('Error saving chat:', error);
//     throw error;
//   }
// };

export const saveChat = async (pdfId, question, answer) => {
  try {
    // Save general chat (no pdfId)
    if (!pdfId && question && answer) {
      const response = await api.post('/save-chat', {
        question,
        answer
      });
      return response.data;
    }

    if (pdfId && question && answer) {
      const response = await api.post('/save-chat', { 
        pdfId, 
        question, 
        answer 
      });
      return response.data;
    } 
    
    if (pdfId) {
      const response = await api.post('/save-chat', { 
        pdfId, 
        question: "🔖 Chat saved", 
        answer: "The user saved this chat session at " + new Date().toLocaleString() 
      });
      return { ...response.data, success: true };
    }

    throw new Error('Invalid parameters for saveChat');
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
};


export const getAllChats = async () => {
  try {
    const response = await api.get('/all-chats');
    return response.data;
  } catch (error) {
    console.error('Error getting all chats:', error);
    throw error;
  }
};

export const getChatHistory = async (pdfId) => {
  try {
    const response = await api.get(`/chat-history/${pdfId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
}; 