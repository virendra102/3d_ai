# BharatBizTech AI Chat Bot

A powerful AI chatbot application with document analysis capabilities, powered by OpenAI's models.

## Features

- **Interactive AI Chat**: Natural language interactions with advanced AI models
- **Document Analysis**: Upload and analyze PDF documents 
- **3D Avatar**: Visual AI representation with speech capabilities
- **Responsive Design**: Works on desktop and mobile devices
- **Chat History**: Review and continue previous conversations

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **PDF Processing**: pdf.js and custom extraction pipeline

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- NPM or Yarn
- MongoDB instance (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/bharatbiztech-ai-bot.git
   cd bharatbiztech-ai-bot
   ```

2. Install frontend dependencies
   ```
   cd ai-bot-frontend
   npm install
   ```

3. Install backend dependencies
   ```
   cd ../ai-bot-backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Application

1. Start the backend server
   ```
   cd ai-bot-backend
   npm start
   ```

2. Start the frontend development server
   ```
   cd ai-bot-frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
bharatbiztech-ai-bot/
├── ai-bot-frontend/          # React frontend application
│   ├── public/               # Static files
│   └── src/                  # Source code
│       ├── components/       # React components
│       ├── contexts/         # React contexts
│       ├── hooks/            # Custom hooks
│       ├── services/         # API services
│       └── styles/           # CSS and styling
│
└── ai-bot-backend/           # Node.js backend application
    ├── controllers/          # Route controllers
    ├── middleware/           # Express middleware
    ├── models/               # MongoDB schemas
    ├── routes/               # API routes
    └── utils/                # Utility functions
```

## API Documentation

The backend provides the following API endpoints:

- `POST /api/chat`: Send a message to the AI and get a response
- `POST /api/upload`: Upload a PDF document for analysis
- `GET /api/documents`: Get a list of uploaded documents
- `GET /api/chat-history`: Get chat history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI models
- MongoDB for database services
- All open-source libraries used in this project
