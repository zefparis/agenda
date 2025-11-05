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
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className={`w-full px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm ${
          enabled
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white animate-pulse'
            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
        }`}
        title={enabled ? 'Désactiver le mode conversation continue' : 'Activer le mode conversation continue'}
      >
        {enabled ? (
          <>
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Écoute Active</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span className="text-sm">Mode Continu</span>
          </>
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
