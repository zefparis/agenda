'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  autoStart?: boolean; // Démarrer automatiquement l'écoute
}

export function VoiceInput({ onTranscript, disabled, autoStart }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

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
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);

        // Si le résultat est final
        if (event.results[event.results.length - 1].isFinal) {
          console.log('🎤 Final transcript:', currentTranscript);
          onTranscript(currentTranscript);
          setTranscript('');
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  // Démarrer automatiquement si autoStart est true
  useEffect(() => {
    if (autoStart && recognitionRef.current && !isListening && !disabled) {
      console.log('🎤 Auto-démarrage de la reconnaissance vocale...');
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [autoStart, disabled, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current || disabled) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null; // Masquer le bouton si non supporté
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Arrêter l\'écoute' : 'Commande vocale'}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            <span className="hidden sm:inline">Écoute...</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span className="hidden sm:inline">Vocal</span>
          </>
        )}
      </motion.button>

      {/* Transcript en cours */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 p-3 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 rounded-xl text-sm text-purple-900 dark:text-purple-100"
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
