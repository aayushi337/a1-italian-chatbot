import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Volume2, Book, Brain, MessageCircle, Sparkles } from 'lucide-react';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialMessage = {
      id: 'initial',
      type: 'bot',
      content: 'Ciao! Sono il tuo assistente per imparare l\'italiano. Come posso aiutarti oggi?',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId: sessionId
        }),
      });

      const data = await response.json();
      
      if (!sessionId) {
        setSessionId(data.sessionId);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        additionalData: data.additionalData
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Scusa, ho avuto un problema. Puoi riprovare?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const renderAdditionalData = (data) => {
    if (!data) return null;

    switch (data.type) {
      case 'vocabulary':
        return (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Book className="w-4 h-4" />
              {data.data.category}
            </h4>
            <div className="grid gap-2">
              {data.data.words.map((word, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{word.italian}</span>
                      <span className="text-gray-600 ml-2">= {word.english}</span>
                    </div>
                    <button
                      onClick={() => speakText(word.italian)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    🗣️ {word.pronunciation}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 italic">
                    "{word.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grammar':
        return (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Grammatica
            </h4>
            <div className="space-y-3">
              {Object.entries(data.data).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-800 capitalize">{key}</div>
                  {value.english && (
                    <div className="text-sm text-gray-600">({value.english})</div>
                  )}
                  {value.conjugation && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(value.conjugation).map(([pronoun, form]) => (
                        <div key={pronoun}>
                          <span className="font-medium">{pronoun}:</span> {form}
                        </div>
                      ))}
                    </div>
                  )}
                  {value.examples && (
                    <div className="mt-2 text-sm text-gray-600">
                      {value.examples.map((example, idx) => (
                        <div key={idx} className="italic">• {example}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Esercizio
            </h4>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-800">{data.data.question}</div>
              <div className="mt-2 text-sm text-gray-600">
                Categoria: {data.data.category}
              </div>
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">
                  {data.data.italian} = {data.data.english}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  🗣️ {data.data.pronunciation}
                </div>
              </div>
              <button
                onClick={() => speakText(data.data.italian)}
                className="text-orange-500 hover:text-orange-700"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="bg-white shadow-sm border-b p-4 rounded-3xl mx-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mx-2">
            <div>
              <h2 className="font-semibold text-gray-800">Italian Learning Assistant</h2>
              <p className="text-sm text-gray-600">Livello A1 - Principiante</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Mode: Learning</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-md'
              } rounded-2xl px-4 py-3`}
            >
              <div className="flex items-start gap-2">
                {message.type === 'bot' && (
                  <Bot className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.additionalData && renderAdditionalData(message.additionalData)}
                </div>
                {message.type === 'user' && (
                  <User className="w-5 h-5 text-blue-100 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Scrivi un messaggio in italiano o inglese..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setInputValue('vocabulary family')}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-colors"
          >
            Famiglia
          </button>
          <button
            onClick={() => setInputValue('vocabulary colors')}
            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors"
          >
            Colori
          </button>
          <button
            onClick={() => setInputValue('vocabulary numbers')}
            className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-colors"
          >
            Numeri
          </button>
          <button
            onClick={() => setInputValue('practice')}
            className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full text-sm transition-colors"
          >
            Praticare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;