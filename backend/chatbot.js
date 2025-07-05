import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const vocabulary = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'vocabulary.json'), 'utf8'));
const phrases = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'phrases.json'), 'utf8'));
const grammar = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'grammar.json'), 'utf8'));
const responses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'responses.json'), 'utf8'));

class ItalianChatbot {
  constructor() {
    this.context = {
      lastTopic: null,
      learningProgress: {},
      conversationHistory: []
    };
  }

  getRandomResponse(category) {
    const responseArray = responses[category];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/\b(hello|hi|ciao|buongiorno|buonasera|salve)\b/)) {
      return 'greeting';
    }
    
    if (lowerMessage.match(/\b(help|aiuto|non capisco|non so)\b/)) {
      return 'help';
    }
    
    if (lowerMessage.match(/\b(word|parola|vocabulary|vocabolario|translate|tradurre)\b/)) {
      return 'vocabulary';
    }
    
    if (lowerMessage.match(/\b(grammar|grammatica|verb|verbo|conjugation|coniugazione)\b/)) {
      return 'grammar';
    }
    
    if (lowerMessage.match(/\b(practice|praticare|exercise|esercizio|quiz)\b/)) {
      return 'practice';
    }
    
    if (lowerMessage.match(/\b(family|famiglia|colors|colori|numbers|numeri|greetings|saluti)\b/)) {
      return 'topic';
    }
    
    if (lowerMessage.match(/\b(how|come|what|cosa|che|why|perché|quando|where|dove)\b/)) {
      return 'question';
    }
    
    return 'general';
  }

  findVocabularyWord(word) {
    const lowerWord = word.toLowerCase();
    
    for (const category in vocabulary) {
      const words = vocabulary[category].words;
      for (const item of words) {
        if (item.italian.toLowerCase() === lowerWord || 
            item.english.toLowerCase() === lowerWord) {
          return { ...item, category: vocabulary[category].category };
        }
      }
    }
    return null;
  }

  getTopicVocabulary(topic) {
    const topicMap = {
      'family': 'family',
      'famiglia': 'family',
      'colors': 'colors',
      'colori': 'colors',
      'numbers': 'numbers',
      'numeri': 'numbers',
      'greetings': 'greetings',
      'saluti': 'greetings'
    };
    
    const mappedTopic = topicMap[topic.toLowerCase()];
    return mappedTopic ? vocabulary[mappedTopic] : null;
  }

  generatePracticeQuestion() {
    const categories = Object.keys(vocabulary);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = vocabulary[randomCategory].words;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    const questionTypes = [
      `Come si dice "${randomWord.english}" in italiano?`,
      `Cosa significa "${randomWord.italian}"?`,
      `Come si pronuncia "${randomWord.italian}"?`
    ];
    
    const randomQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    return {
      question: randomQuestion,
      answer: randomWord,
      category: vocabulary[randomCategory].category
    };
  }

  processMessage(message) {
    const intent = this.detectIntent(message);
    this.context.conversationHistory.push({ message, intent, timestamp: new Date() });
    
    let response = "";
    let additionalData = null;
    
    switch (intent) {
      case 'greeting':
        response = this.getRandomResponse('greetings');
        break;
        
      case 'help':
        response = `Posso aiutarti con:
        • Vocabolario (scrivi "vocabulary" + argomento)
        • Grammatica (scrivi "grammar" + argomento)
        • Esercizi (scrivi "practice")
        • Traduzioni (scrivi una parola in italiano o inglese)
        
        Esempio: "vocabulary family" o "grammar verbs"`;
        break;
        
      case 'vocabulary':
        const words = message.split(' ');
        const topic = words.find(word => 
          ['family', 'colors', 'numbers', 'greetings', 'famiglia', 'colori', 'numeri', 'saluti'].includes(word.toLowerCase())
        );
        
        if (topic) {
          const topicData = this.getTopicVocabulary(topic);
          if (topicData) {
            response = `Ecco il vocabolario per ${topicData.category}:`;
            additionalData = { type: 'vocabulary', data: topicData };
          } else {
            response = "Non conosco questo argomento. Prova con: family, colors, numbers, greetings";
          }
        } else {
          response = "Quale argomento vuoi studiare? Prova: family, colors, numbers, greetings";
        }
        break;
        
      case 'grammar':
        if (message.toLowerCase().includes('verb')) {
          response = "Ecco i verbi più importanti in italiano:";
          additionalData = { type: 'grammar', data: grammar.verbs };
        } else if (message.toLowerCase().includes('article')) {
          response = "Ecco gli articoli italiani:";
          additionalData = { type: 'grammar', data: grammar.articles };
        } else {
          response = `Grammatica italiana - cosa vuoi sapere?
          • Verbi (scrivi "grammar verbs")
          • Articoli (scrivi "grammar articles")`;
        }
        break;
        
      case 'practice':
        const practiceQuestion = this.generatePracticeQuestion();
        response = `Pratichiamo! ${practiceQuestion.question}`;
        additionalData = { type: 'practice', data: practiceQuestion };
        break;
        
      case 'topic':
        const detectedTopic = message.toLowerCase().match(/\b(family|famiglia|colors|colori|numbers|numeri|greetings|saluti)\b/)[0];
        const topicVocab = this.getTopicVocabulary(detectedTopic);
        if (topicVocab) {
          response = `Parliamo di ${topicVocab.category}! Ecco alcune parole utili:`;
          additionalData = { type: 'vocabulary', data: topicVocab };
        }
        break;
        
      case 'question':
        const wordsInMessage = message.split(' ');
        for (const word of wordsInMessage) {
          const foundWord = this.findVocabularyWord(word);
          if (foundWord) {
            response = `${foundWord.italian} = ${foundWord.english}
            Pronuncia: ${foundWord.pronunciation}
            Esempio: ${foundWord.example}`;
            additionalData = { type: 'translation', data: foundWord };
            break;
          }
        }
        
        if (!additionalData) {
          response = this.getRandomResponse('fallback');
        }
        break;
        
      default:
        const messageWords = message.split(' ');
        for (const word of messageWords) {
          const foundWord = this.findVocabularyWord(word);
          if (foundWord) {
            response = `${foundWord.italian} = ${foundWord.english}
            Pronuncia: ${foundWord.pronunciation}
            Esempio: ${foundWord.example}`;
            additionalData = { type: 'translation', data: foundWord };
            break;
          }
        }
        
        if (!additionalData) {
          response = this.getRandomResponse('fallback');
        }
    }
    
    return {
      response,
      additionalData,
      intent
    };
  }
}

export default ItalianChatbot;