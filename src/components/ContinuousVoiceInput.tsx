'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContinuousVoiceInputProps {
  onTranscript: (text: string) => void;
  isAssistantSpeaking?: boolean; // Pour désactiver l'écoute pendant que l'assistant parle
  enabled: boolean; // Mode continu activé/désactivé
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
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Vérifier si Web Speech API est supportée
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = true; // Mode continu
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        // Effacer le timeout de silence
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
        lastTranscriptRef.current = currentTranscript;

        // Si le résultat est final, envoyer rapidement
        if (event.results[event.results.length - 1].isFinal) {
          console.log('🎤 Final transcript detected:', currentTranscript);
          
          // Réduire le délai à 700ms pour plus de réactivité
          silenceTimeoutRef.current = setTimeout(() => {
            const finalText = lastTranscriptRef.current.trim();
            if (finalText) {
              console.log('🎤 Sending transcript:', finalText);
              onTranscript(finalText);
              setTranscript('');
              lastTranscriptRef.current = '';
            }
          }, 700);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        
        // Si l'erreur n'est pas "no-speech", redémarrer en mode continu
        if (event.error !== 'no-speech' && enabled && !isAssistantSpeaking) {
          console.log('🔄 Restarting recognition after error...');
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && enabled && !isAssistantSpeaking) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (err) {
                console.error('Failed to restart:', err);
              }
            }
          }, 500);
        }
      };

      recognition.onend = () => {
        console.log('🎤 Recognition ended');
        setIsListening(false);
        
        // Redémarrer rapidement en mode continu
        if (enabled && !isAssistantSpeaking) {
          console.log('🔄 Auto-restarting recognition...');
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && enabled && !isAssistantSpeaking) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (err) {
                console.error('Failed to auto-restart:', err);
              }
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [onTranscript, enabled, isAssistantSpeaking]);

  // Gérer l'activation/désactivation du mode continu
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (enabled && !isAssistantSpeaking) {
      // Démarrer l'écoute
      if (!isListening) {
        try {
          console.log('🎤 Starting continuous listening...');
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error('Failed to start:', err);
        }
      }
    } else {
      // Arrêter l'écoute
      if (isListening) {
        console.log('🎤 Stopping continuous listening...');
        try {
          recognitionRef.current.stop();
          setIsListening(false);
          setTranscript('');
        } catch (err) {
          console.error('Failed to stop:', err);
        }
      }
    }
  }, [enabled, isAssistantSpeaking, isListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className={`p-2.5 sm:p-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
          enabled
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
        }`}
        title={enabled ? 'Désactiver le mode conversation continue' : 'Activer le mode conversation continue'}
      >
        {enabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      {/* Indicateur d'écoute */}
      <AnimatePresence>
        {isListening && !isAssistantSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"
          />
        )}
      </AnimatePresence>

      {/* Transcript en cours */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 min-w-[200px] p-3 bg-green-100 dark:bg-green-900/50 border-2 border-green-300 dark:border-green-700 rounded-xl text-sm text-green-900 dark:text-green-100"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="italic">{transcript}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
