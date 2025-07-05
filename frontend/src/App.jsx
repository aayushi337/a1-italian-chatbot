import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatBot from './components/ChatBot';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="min-h-screen">
      {showChat ? (
        <div className="h-screen">
          <ChatBot onClose={handleCloseChat} />
        </div>
      ) : (
        <WelcomeScreen onStartChat={handleStartChat} />
      )}
    </div>
  );
}

export default App;