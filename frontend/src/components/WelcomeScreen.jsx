import React from 'react';
import { MessageCircle, Book, Brain, Volume2, Sparkles, Globe, Users, Award } from 'lucide-react';

const WelcomeScreen = ({ onStartChat }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-purple-50">
      <div className="bg-white shadow-md rounded-3xl mx-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-800">ItalianBot</h1>
                <p className="text-sm text-gray-600">A1 Level Learning Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Mode: Learning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Benvenuti! Welcome to Italian Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your Italian journey with this chatbot designed specifically for A1 level beginners. 
            Learn vocabulary, grammar, and practice conversations in an interactive way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Vocabulary</h3>
            <p className="text-gray-600">Learn essential Italian words for family, colors, numbers, and everyday situations.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Grammar</h3>
            <p className="text-gray-600">Master basic Italian grammar including verbs, articles, and sentence structure.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pronunciation</h3>
            <p className="text-gray-600">Practice Italian pronunciation with audio playback and phonetic guides.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Practice</h3>
            <p className="text-gray-600">Interactive exercises and quizzes to reinforce your learning progress.</p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Sei pronto?</h3>          
          <button
            onClick={onStartChat}
            className="bg-green-200 text-green-800 font-medium hover:font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            Start Learning Italian
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;