'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Trash2, Bot, User, Mic, Calendar, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from './VoiceInput';
import { ContinuousVoiceInput } from './ContinuousVoiceInput';
import { ActionButton } from './ActionButton';
import { FavoriteLinks } from './FavoriteLinks';
import { WakeIndicator } from './WakeIndicator';
import { PermissionBanner } from './PermissionBanner';
import { useWakeWord } from '@/hooks/useWakeWord';
import { useWakeWordMobile } from '@/hooks/useWakeWordMobile';
import { parseAction, cleanMessage } from '@/lib/chatActions';
import { parseExternalActions, cleanExternalActionFromMessage, hasExternalAction } from '@/lib/externalActions';
import { formatMessageWithLinks } from '@/lib/linkify';
import { ExternalAction } from '@/types/actions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  externalAction?: ExternalAction;
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
  const [autoStartVoice, setAutoStartVoice] = useState(false); // Pour auto-démarrer après wake word
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false); // Mode conversation continue désactivé par défaut
  const [showContinuousHelp, setShowContinuousHelp] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Détecter si mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Afficher l'aide lors de l'activation du mode continu
  useEffect(() => {
    if (continuousMode) {
      setShowContinuousHelp(true);
      // Afficher l'aide pendant 8 secondes
      const timer = setTimeout(() => setShowContinuousHelp(false), 8000);
      return () => clearTimeout(timer);
    } else {
      setShowContinuousHelp(false);
    }
  }, [continuousMode]);

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
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
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

      // Vérifier si le message contient une action d'événement
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

      // Vérifier si le message contient une action externe
      if (hasExternalAction(assistantMessage)) {
        const externalAction = parseExternalActions(assistantMessage);
        if (externalAction) {
          console.log('🔗 Action externe détectée:', externalAction);
          
          // Nettoyer le message et ajouter l'action
          const cleanedContent = cleanExternalActionFromMessage(assistantMessage);
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: cleanedContent, externalAction } : m
          ));
        }
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
    // Nettoyer le timeout
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    
    setInput(transcript);
    setShowVoice(false);
    setAutoStartVoice(false); // Réinitialiser l'auto-start
    
    // Auto-submit immédiatement après transcription
    handleSubmit(null as any, { data: transcript });
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

  // Fonction TTS pour confirmer l'activation
  const speakConfirmation = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Activer automatiquement la commande vocale après détection du wake word
  const handleWakeDetection = useCallback(() => {
    console.log('🔥 Wake word détecté dans ChatAssistant');
    
    // TTS: Confirmation vocale
    speakConfirmation('Oui, je t\'écoute !');
    
    // Activer la saisie vocale avec auto-start
    setShowVoice(true);
    setAutoStartVoice(true);
    
    // Timeout automatique après 15 secondes de silence
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
    }
    
    voiceTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Timeout: fermeture automatique de la commande vocale');
      setShowVoice(false);
      setAutoStartVoice(false);
    }, 15000);
  }, [speakConfirmation]);

  // Hook pour le wake word "Hello Benji" (desktop)
  const wakeWordDesktop = useWakeWord({
    accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY || '',
    modelPath: '/models/hello_benji.ppn',
    sensitivity: 0.5,
    enabled: wakeWordEnabled && !isMobile,
    onWake: handleWakeDetection,
    autoStart: true
  });

  // Hook pour le wake word "Hello Benji" (mobile)
  const wakeWordMobile = useWakeWordMobile({
    accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY || '',
    modelPath: '/models/hello_benji.ppn',
    sensitivity: 0.5,
    enabled: wakeWordEnabled && isMobile,
    onWake: handleWakeDetection,
    autoStart: true
  });

  // Sélectionner le bon hook selon la plateforme
  const wakeWord = isMobile ? wakeWordMobile : wakeWordDesktop;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Assistant IA</h2>
              <p className="text-xs text-blue-100 hidden sm:block">GPT-5 • En ligne</p>
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
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-3">
              Je suis votre assistant personnel. Posez-moi des questions ou demandez-moi de gérer votre agenda !
            </p>
            
            {/* Info Mode Continu */}
            <div className="max-w-md mx-auto mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                💡 <strong>Astuce :</strong> Activez le bouton <strong>"Mode Continu"</strong> en bas pour avoir une conversation ouverte. Je vous écouterai en permanence sans besoin de cliquer !
              </p>
            </div>
            
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

            {/* Favoris et historique des liens */}
            <div className="mt-8 max-w-2xl mx-auto">
              <FavoriteLinks />
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
                  <div 
                    className="message-content text-sm whitespace-pre-wrap [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10"
                    dangerouslySetInnerHTML={{ __html: formatMessageWithLinks(message.content) }}
                  />
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
                
                {/* Action externe button */}
                {message.role === 'assistant' && message.externalAction && (
                  <ActionButton action={message.externalAction} />
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

      {/* Permission Banner (mobile uniquement) */}
      {isMobile && 'requestPermission' in wakeWord && (
        <PermissionBanner
          hasPermission={wakeWord.isInitialized}
          onRequestPermission={wakeWord.requestPermission}
          platform={wakeWord.platform || 'android'}
        />
      )}

      {/* Wake Word Indicator */}
      <WakeIndicator 
        isListening={wakeWord.isListening} 
        isWakeDetected={wakeWord.isWakeDetected}
      />

      {/* Continuous Mode Help */}
      <AnimatePresence>
        {showContinuousHelp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-3 sm:mx-4 mb-2 p-3 bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-xl text-sm text-green-800 dark:text-green-200"
          >
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Mode Conversation Continue Activé ! 🎤</p>
                <p className="text-xs">Je vous écoute en permanence. Parlez naturellement, après 0,7s de silence votre message sera automatiquement envoyé. Vous pouvez désactiver ce mode avec le bouton vert "Écoute Active".</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onClick={() => {
              setShowVoice(!showVoice);
              setAutoStartVoice(false); // Ne pas auto-démarrer sur clic manuel
            }}
            className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            title="Commande vocale"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Continuous Mode Button */}
          <div className="flex-shrink-0">
            <ContinuousVoiceInput
              onTranscript={handleVoiceTranscript}
              isAssistantSpeaking={isLoading}
              enabled={continuousMode}
              onToggle={() => setContinuousMode(!continuousMode)}
            />
          </div>

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
            <VoiceInput 
              onTranscript={handleVoiceTranscript} 
              autoStart={autoStartVoice}
            />
          </div>
        )}
      </form>
    </div>
  );
}
