/**
 * Composant de fallback pour accès direct au microphone
 * Utilisé quand le wake word ne fonctionne pas ou est désactivé
 * Compatible PWA mobile
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicrophoneFallbackProps {
  onTranscript: (text: string) => void;
  enabled?: boolean;
  className?: string;
}

interface DiagnosticInfo {
  isSecureContext: boolean;
  hasGetUserMedia: boolean;
  hasWebSpeech: boolean;
  audioContextState?: string;
  permissionState?: PermissionState;
}

export function MicrophoneFallback({ 
  onTranscript, 
  enabled = true,
  className = ''
}: MicrophoneFallbackProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo>({
    isSecureContext: false,
    hasGetUserMedia: false,
    hasWebSpeech: false
  });
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  /**
   * Diagnostic complet
   */
  useEffect(() => {
    const runDiagnostic = async () => {
      const info: DiagnosticInfo = {
        isSecureContext: window.isSecureContext,
        hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasWebSpeech: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      };

      // Vérifier AudioContext
      if (audioContextRef.current) {
        info.audioContextState = audioContextRef.current.state;
      }

      // Vérifier permission micro
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          info.permissionState = result.state;
        } catch (err) {
          console.warn('Permissions API non supportée');
        }
      }

      setDiagnostic(info);

      // Afficher diagnostic si problèmes détectés
      if (!info.isSecureContext || !info.hasGetUserMedia || !info.hasWebSpeech) {
        console.error('❌ Problèmes détectés:', info);
      }
    };

    runDiagnostic();
  }, []);

  /**
   * Initialiser Web Speech API
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Reconnaissance vocale non supportée par ce navigateur');
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

      // Si résultat final
      if (event.results[event.results.length - 1].isFinal) {
        console.log('🎤 Transcript final:', currentTranscript);
        onTranscript(currentTranscript);
        setTranscript('');
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Erreur reconnaissance vocale:', event.error);
      
      // Messages d'erreur en français
      const errorMessages: Record<string, string> = {
        'not-allowed': 'Permission microphone refusée. Autorisez l\'accès dans les paramètres.',
        'no-speech': 'Aucun son détecté. Parlez plus fort ou vérifiez votre micro.',
        'audio-capture': 'Microphone non disponible ou occupé par une autre app.',
        'network': 'Connexion réseau requise pour la reconnaissance vocale.',
        'aborted': 'Reconnaissance vocale interrompue.'
      };

      setError(errorMessages[event.error] || `Erreur: ${event.error}`);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Reconnaissance vocale terminée');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  /**
   * Créer/Reprendre AudioContext
   */
  const ensureAudioContext = async () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
    }

    // Reprendre si suspendu
    if (audioContextRef.current.state === 'suspended') {
      console.log('🎵 Reprise AudioContext...');
      await audioContextRef.current.resume();
    }

    console.log('🎵 AudioContext state:', audioContextRef.current.state);
  };

  /**
   * Tester les permissions micro
   */
  const testMicrophonePermission = async (): Promise<boolean> => {
    try {
      console.log('🎤 Test permission micro...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Permission micro accordée');
      return true;
    } catch (err) {
      console.error('❌ Permission micro refusée:', err);
      setError('Permission microphone refusée. Autorisez l\'accès dans les paramètres de votre navigateur.');
      return false;
    }
  };

  /**
   * Démarrer l'écoute
   */
  const startListening = async () => {
    if (!recognitionRef.current || !enabled) return;

    try {
      setError(null);

      // 1. Vérifier secure context
      if (!window.isSecureContext) {
        throw new Error('HTTPS requis pour utiliser le microphone');
      }

      // 2. Tester permission micro
      const hasPermission = await testMicrophonePermission();
      if (!hasPermission) return;

      // 3. Reprendre AudioContext
      await ensureAudioContext();

      // 4. Démarrer reconnaissance
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      console.log('🎤 Écoute démarrée');

    } catch (err) {
      console.error('❌ Erreur démarrage micro:', err);
      setError(err instanceof Error ? err.message : 'Impossible de démarrer le microphone');
      setIsListening(false);
    }
  };

  /**
   * Arrêter l'écoute
   */
  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      console.log('🎤 Écoute arrêtée');
    } catch (err) {
      console.error('❌ Erreur arrêt micro:', err);
    }
  };

  /**
   * Toggle écoute
   */
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  /**
   * Affichage diagnostic
   */
  const renderDiagnostic = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm"
    >
      <h4 className="font-bold mb-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Diagnostic Microphone
      </h4>
      
      <div className="space-y-2">
        <DiagnosticItem 
          label="Contexte sécurisé (HTTPS)"
          status={diagnostic.isSecureContext}
        />
        <DiagnosticItem 
          label="getUserMedia supporté"
          status={diagnostic.hasGetUserMedia}
        />
        <DiagnosticItem 
          label="Web Speech API supportée"
          status={diagnostic.hasWebSpeech}
        />
        {diagnostic.permissionState && (
          <DiagnosticItem 
            label="Permission microphone"
            status={diagnostic.permissionState === 'granted'}
            info={diagnostic.permissionState}
          />
        )}
        {diagnostic.audioContextState && (
          <DiagnosticItem 
            label="AudioContext"
            status={diagnostic.audioContextState === 'running'}
            info={diagnostic.audioContextState}
          />
        )}
      </div>

      {!diagnostic.isSecureContext && (
        <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200">
          ⚠️ <strong>HTTPS requis</strong> - Le microphone ne fonctionne qu'en HTTPS (ou localhost)
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={className}>
      {/* Bouton micro */}
      <motion.button
        type="button"
        onClick={toggleListening}
        disabled={!enabled || !diagnostic.hasWebSpeech}
        whileTap={{ scale: 0.95 }}
        className={`
          w-full p-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl 
          flex items-center justify-center gap-3
          ${isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
          }
          ${!enabled || !diagnostic.hasWebSpeech ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={isListening ? 'Arrêter l\'écoute' : 'Commencer à parler'}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            <span>Écoute en cours...</span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>🎤 Appuyer pour parler</span>
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
            className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl"
          >
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Mic className="w-4 h-4 animate-pulse" />
              <span className="italic">{transcript}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl"
          >
            <div className="flex items-start gap-2 text-red-900 dark:text-red-100">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle diagnostic */}
      <button
        onClick={() => setShowDiagnostic(!showDiagnostic)}
        className="mt-3 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
      >
        {showDiagnostic ? 'Masquer' : 'Afficher'} le diagnostic
      </button>

      {/* Diagnostic */}
      <AnimatePresence>
        {showDiagnostic && renderDiagnostic()}
      </AnimatePresence>
    </div>
  );
}

/**
 * Item de diagnostic
 */
function DiagnosticItem({ 
  label, 
  status, 
  info 
}: { 
  label: string; 
  status: boolean; 
  info?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {info && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({info})
          </span>
        )}
        {status ? (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        )}
      </div>
    </div>
  );
}
