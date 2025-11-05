/**
 * Hook React pour gérer l'activation vocale "Hello Benji"
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initWakeWord,
  startWakeWordListening,
  stopWakeWordListening,
  releaseWakeWord,
  isWakeWordReady
} from '@/lib/voiceWake';
import type { WakeWordState } from '@/types/wakeword';

interface UseWakeWordOptions {
  accessKey: string;
  modelPath: string;
  sensitivity?: number;
  enabled?: boolean;
  onWake: () => void;
  autoStart?: boolean;
}

interface UseWakeWordReturn extends WakeWordState {
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  restart: () => Promise<void>;
}

/**
 * Hook pour gérer l'activation vocale "Hello Benji"
 * @param options Configuration et callbacks
 * @returns État et méthodes de contrôle
 */
export function useWakeWord(options: UseWakeWordOptions): UseWakeWordReturn {
  const [state, setState] = useState<WakeWordState>({
    isInitialized: false,
    isListening: false,
    isWakeDetected: false,
    error: null
  });

  const hasInitialized = useRef(false);
  const isMounted = useRef(true);

  // Callback sécurisé pour la détection
  const handleWake = useCallback(() => {
    if (!isMounted.current) return;

    console.log('🔔 Wake word callback déclenché');
    setState(prev => ({ ...prev, isWakeDetected: true }));
    
    // Déclencher le callback utilisateur
    options.onWake();

    // Réinitialiser après 2 secondes
    setTimeout(() => {
      if (isMounted.current) {
        setState(prev => ({ ...prev, isWakeDetected: false }));
      }
    }, 2000);
  }, [options.onWake]);

  // Initialisation de Porcupine
  useEffect(() => {
    if (!options.enabled || hasInitialized.current) {
      return;
    }

    let mounted = true;
    hasInitialized.current = true;

    const initialize = async () => {
      try {
        console.log('🚀 Initialisation du wake word...');
        
        const instance = await initWakeWord(
          {
            accessKey: options.accessKey,
            modelPath: options.modelPath,
            sensitivity: options.sensitivity
          },
          {
            onWake: handleWake,
            onInit: () => {
              if (mounted) {
                setState(prev => ({ ...prev, isInitialized: true, error: null }));
                console.log('✅ Hook: Wake word initialisé');
              }
            },
            onError: (error) => {
              if (mounted) {
                setState(prev => ({ 
                  ...prev, 
                  error: error.message,
                  isInitialized: false 
                }));
                console.error('❌ Hook: Erreur wake word', error);
              }
            }
          }
        );

        // Démarrage automatique si demandé
        if (instance && options.autoStart && mounted) {
          const started = await startWakeWordListening();
          if (started && mounted) {
            setState(prev => ({ ...prev, isListening: true }));
          }
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            isInitialized: false 
          }));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [options.enabled, options.accessKey, options.modelPath, options.sensitivity, options.autoStart, handleWake]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (hasInitialized.current) {
        releaseWakeWord();
      }
    };
  }, []);

  // Méthode pour démarrer l'écoute
  const start = useCallback(async (): Promise<boolean> => {
    if (!isWakeWordReady()) {
      console.warn('⚠️ Wake word pas prêt');
      return false;
    }

    const started = await startWakeWordListening();
    if (started && isMounted.current) {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    }
    return started;
  }, []);

  // Méthode pour arrêter l'écoute
  const stop = useCallback(async (): Promise<void> => {
    await stopWakeWordListening();
    if (isMounted.current) {
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  // Méthode pour redémarrer
  const restart = useCallback(async (): Promise<void> => {
    await stop();
    setTimeout(() => {
      start();
    }, 500);
  }, [start, stop]);

  return {
    ...state,
    start,
    stop,
    restart
  };
}
