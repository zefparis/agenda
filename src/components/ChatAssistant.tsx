'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash2, Bot, User, Mic, Calendar, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from './VoiceInput';
import { parseAction, cleanMessage } from '@/lib/chatActions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAssistantProps {
  onEventAction?: (action: any) => Promise<void>;
  events?: any[];
}

export function ChatAssistant({ onEventAction, events = [] }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVoice, setShowVoice] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup : arrêter la lecture au démontage du composant
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent | any, options?: { data?: string }) => {
    if (e) e.preventDefault();
    
    const messageContent = options?.data || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          events: events // Passer les événements pour contexte
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || 'Erreur de réponse du serveur';
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Pas de stream disponible');
      }

      let assistantMessage = '';
      const assistantId = Date.now().toString();

      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: ''
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: assistantMessage } : m
        ));
      }

      // Vérifier si le message contient une action
      const action = parseAction(assistantMessage);
      if (action && onEventAction) {
        console.log('🗓️ Action détectée:', action);
        await onEventAction(action);
        
        // Nettoyer le message pour l'affichage
        const cleanedMessage = cleanMessage(assistantMessage);
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: cleanedMessage } : m
        ));
      }

    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    setShowVoice(false);
    // Auto-submit après transcription
    setTimeout(() => {
      handleSubmit(null as any, { data: transcript });
    }, 100);
  };

  const speak = (text: string, messageId: string) => {
    // Arrêter toute lecture en cours
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (speakingId === messageId) {
        setSpeakingId(null);
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeakingId(messageId);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Assistant IA</h2>
              <p className="text-xs text-blue-100 hidden sm:block">GPT-4o Mini • En ligne</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Nouvelle conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="w-16 h-16 mx-auto mb-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Bonjour ! 👋
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Je suis votre assistant personnel. Posez-moi des questions ou demandez-moi de gérer votre agenda !
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                '📅 Crée un rdv demain 14h',
                '🔍 Qu\'ai-je aujourd\'hui ?',
                '⏰ Prochain événement ?'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSubmit(new Event('submit') as any, { data: suggestion })}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.role === 'assistant' && message.content && (
                  <button
                    onClick={() => speak(message.content, message.id)}
                    className="self-start px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300"
                    title={speakingId === message.id ? 'Arrêter la lecture' : 'Lire à voix haute'}
                  >
                    {speakingId === message.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Arrêter</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Écouter</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Réflexion en cours...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-800 dark:text-red-300">
            Erreur : {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
          />
          
          {/* Voice Button */}
          <button
            type="button"
            onClick={() => setShowVoice(!showVoice)}
            className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            title="Commande vocale"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 p-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Voice Input Modal */}
        {showVoice && (
          <div className="mt-3">
            <VoiceInput onTranscript={handleVoiceTranscript} />
          </div>
        )}
      </form>
    </div>
  );
}
