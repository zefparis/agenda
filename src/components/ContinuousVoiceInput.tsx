'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContinuousVoiceInputProps {
  onTranscript: (text: string) => void;
  isAssistantSpeaking?: boolean;
  enabled: boolean;
  onToggle: () => void;
}

export function ContinuousVoiceInput({ 
  onTranscript, 
  isAssistantSpeaking = false,
  enabled,
  onToggle
}: ContinuousVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  // Fonction pour démarrer la reconnaissance
  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || isListening || isProcessingRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('🎤 Reconnaissance vocale démarrée');
    } catch (err) {
      console.error('Erreur démarrage:', err);
    }
  }, [isListening]);

  // Fonction pour arrêter la reconnaissance
  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('🎤 Reconnaissance vocale arrêtée');
    } catch (err) {
      console.error('Erreur arrêt:', err);
    }
  }, [isListening]);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (isProcessingRef.current) return;

      // Effacer le timeout précédent
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      const results = Array.from(event.results);
      const currentTranscript = results
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);

      // Si résultat final, envoyer après 700ms de silence
      const lastResult = results[results.length - 1] as any;
      if (lastResult.isFinal && currentTranscript.trim()) {
        console.log('🎤 Transcription finale:', currentTranscript);
        
        silenceTimeoutRef.current = setTimeout(() => {
          if (!isProcessingRef.current && currentTranscript.trim()) {
            isProcessingRef.current = true;
            console.log('📤 Envoi:', currentTranscript);
            onTranscript(currentTranscript.trim());
            setTranscript('');
            
            // Réinitialiser après envoi
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 500);
          }
        }, 700);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Erreur reconnaissance:', event.error);
      
      if (event.error === 'aborted' || event.error === 'no-speech') {
        // Erreurs normales, on ne fait rien
        return;
      }
      
      // Pour les autres erreurs, redémarrer si le mode est activé
      if (enabled && !isAssistantSpeaking) {
        setTimeout(() => startRecognition(), 1000);
      }
    };

    recognition.onend = () => {
      console.log('🎤 Reconnaissance terminée');
      setIsListening(false);
      
      // Redémarrer si le mode est toujours activé
      if (enabled && !isAssistantSpeaking && !isProcessingRef.current) {
        setTimeout(() => startRecognition(), 300);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          // Ignorer les erreurs d'arrêt
        }
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [onTranscript, enabled, isAssistantSpeaking, startRecognition]);

  // Gérer l'activation/désactivation du mode continu
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (enabled && !isAssistantSpeaking) {
      startRecognition();
    } else {
      stopRecognition();
      setTranscript('');
      isProcessingRef.current = false;
    }
  }, [enabled, isAssistantSpeaking, startRecognition, stopRecognition]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="w-full mb-2">
      {/* Zone de transcription AU-DESSUS - bien visible */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border-2 border-green-400 dark:border-green-600 rounded-2xl shadow-lg"
          >
            <div className="flex items-start gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">
                  🎤 Vous dites :
                </p>
                <p className="text-base font-medium text-green-900 dark:text-green-100 leading-relaxed">
                  {transcript}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur d'écoute en mode continu */}
      <AnimatePresence>
        {isListening && !isAssistantSpeaking && enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl flex items-center gap-2"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">
              En écoute... Parlez maintenant
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
