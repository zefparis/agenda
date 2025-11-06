/**
 * Hook mobile pour wake word "Hello Benji"
 * Optimisé pour Android (Samsung S23)
 * Gère les permissions, pause/reprise, AudioContext mobile
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { initWakeWord, startWakeWordListening, stopWakeWordListening, releaseWakeWord } from '@/lib/voiceWake';
import type { WakeWordState } from '@/types/wakeword';

interface UseWakeWordMobileOptions {
  accessKey: string;
  modelPath: string;
  sensitivity?: number;
  enabled?: boolean;
  autoStart?: boolean;
  onWake: () => void;
  onError?: (error: Error) => void;
  onInit?: () => void;
}

interface UseWakeWordMobileReturn extends WakeWordState {
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  isSupported: boolean;
  isMobile: boolean;
  platform: 'android' | 'ios' | 'desktop';
  diagnosticInfo: DiagnosticInfo;
  fallbackMode: boolean;
}

interface DiagnosticInfo {
  isSecureContext: boolean;
  hasGetUserMedia: boolean;
  hasAudioContext: boolean;
  audioContextState?: string;
  permissionState?: PermissionState;
}

/**
 * Détection de la plateforme
 */
function detectPlatform(): 'android' | 'ios' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = window.navigator.userAgent.toLowerCase();
  
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  
  return 'desktop';
}

/**
 * Vérifier si l'appareil est mobile
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

/**
 * Hook principal
 */
export function useWakeWordMobile(options: UseWakeWordMobileOptions): UseWakeWordMobileReturn {
  const [state, setState] = useState<WakeWordState>({
    isInitialized: false,
    isListening: false,
    isWakeDetected: false,
    error: null
  });
  
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo>({
    isSecureContext: false,
    hasGetUserMedia: false,
    hasAudioContext: false
  });
  
  const platform = detectPlatform();
  const isMobile = isMobileDevice();
  
  const hasInitialized = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<any>(null);
  
  /**
   * Diagnostic du système
   */
  const runDiagnostic = useCallback(async () => {
    try {
      const info: DiagnosticInfo = {
        isSecureContext: window.isSecureContext,
        hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasAudioContext: !!(window.AudioContext || (window as any).webkitAudioContext)
      };

      // État AudioContext
      if (audioContextRef.current) {
        info.audioContextState = audioContextRef.current.state;
      }

      // Permission microphone
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          info.permissionState = result.state;
        } catch (err) {
          console.warn('⚠️ Permissions API non supportée');
        }
      }

      setDiagnosticInfo(info);

      // Activer fallback si problèmes critiques
      if (!info.isSecureContext || !info.hasGetUserMedia) {
        console.warn('⚠️ Problèmes critiques détectés, activation du mode fallback');
        setFallbackMode(true);
      }

      return info;
    } catch (error) {
      console.error('❌ Erreur diagnostic:', error);
      setFallbackMode(true);
      return diagnosticInfo;
    }
  }, [diagnosticInfo]);
  
  /**
   * Demander la permission micro
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('📱 Demande permission micro...');
      
      // Méthode 1: navigator.permissions.query (Chrome Android)
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          
          if (result.state === 'granted') {
            setHasPermission(true);
            return true;
          }
          
          if (result.state === 'prompt') {
            // Déclencher le prompt via getUserMedia
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            return true;
          }
          
          console.warn('⚠️ Permission micro refusée');
          setHasPermission(false);
          return false;
        } catch (err) {
          console.warn('⚠️ permissions.query non supporté, fallback getUserMedia');
        }
      }
      
      // Méthode 2: getUserMedia direct (Samsung Internet, Firefox)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
      
    } catch (error) {
      console.error('❌ Erreur permission micro:', error);
      setState(prev => ({ ...prev, error: 'Permission micro refusée' }));
      setHasPermission(false);
      return false;
    }
  }, []);
  
  /**
   * Initialiser AudioContext mobile
   * IMPORTANT: Sur mobile, AudioContext doit être créé après interaction utilisateur
   */
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext({
        sampleRate: 16000, // Porcupine utilise 16kHz
        latencyHint: 'interactive'
      });
      
      console.log('🎵 AudioContext créé:', audioContextRef.current.state);
      
      // Reprendre l'audio context si suspendu
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (error) {
      console.error('❌ Erreur AudioContext:', error);
    }
  }, []);
  
  /**
   * Demander Wake Lock (garder écran actif si possible)
   */
  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      console.warn('⚠️ Wake Lock API non supportée');
      return;
    }
    
    try {
      wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      console.log('🔓 Wake Lock activé');
      
      wakeLockRef.current.addEventListener('release', () => {
        console.log('🔒 Wake Lock relâché');
      });
    } catch (error) {
      console.warn('⚠️ Wake Lock non disponible:', error);
    }
  }, []);
  
  /**
   * Gérer la visibilité de la page
   */
  const handleVisibilityChange = useCallback(async () => {
    if (document.hidden) {
      console.log('📱 App en arrière-plan');
      // Sur Android, on peut essayer de maintenir l'écoute
      // mais Chrome va probablement suspendre après quelques minutes
    } else {
      console.log('📱 App au premier plan');
      
      // Reprendre AudioContext
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Reprendre l'écoute si elle était active
      if (state.isListening) {
        await startWakeWordListening();
      }
    }
  }, [state.isListening]);
  
  /**
   * Callback wake word détecté
   */
  const handleWake = useCallback(() => {
    console.log('🔥 Wake word détecté (mobile)');
    
    setState(prev => ({ ...prev, isWakeDetected: true }));
    
    // Vibration mobile
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Notifier le Service Worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'WAKEWORD_DETECTED',
        timestamp: Date.now()
      });
    }
    
    // Callback utilisateur
    options.onWake();
    
    // Reset après 2s
    setTimeout(() => {
      setState(prev => ({ ...prev, isWakeDetected: false }));
    }, 2000);
  }, [options]);
  
  /**
   * Initialisation
   */
  useEffect(() => {
    if (!options.enabled || hasInitialized.current) return;
    
    let mounted = true;
    hasInitialized.current = true;
    
    const initialize = async () => {
      try {
        console.log('🚀 Initialisation wake word mobile...');
        
        // 0. Diagnostic système
        await runDiagnostic();
        
        // 1. Vérifier support
        if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
          throw new Error('getUserMedia non supporté');
        }
        
        // 2. Demander permissions
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permission micro refusée');
        }
        
        // 3. Init AudioContext (après interaction utilisateur)
        initAudioContext();
        
        // 4. Init Porcupine
        const instance = await initWakeWord(
          {
            accessKey: options.accessKey,
            modelPath: options.modelPath,
            sensitivity: options.sensitivity || 0.5
          },
          {
            onWake: handleWake,
            onInit: () => {
              if (mounted) {
                setState(prev => ({ ...prev, isInitialized: true, error: null }));
                console.log('✅ Wake word mobile initialisé');
                options.onInit?.();
              }
            },
            onError: (error) => {
              if (mounted) {
                setState(prev => ({ 
                  ...prev, 
                  error: error.message,
                  isInitialized: false 
                }));
                console.error('❌ Erreur wake word mobile:', error);
                options.onError?.(error);
              }
            }
          }
        );
        
        // 5. Démarrer si autoStart
        if (instance && options.autoStart && mounted) {
          const started = await startWakeWordListening();
          if (started && mounted) {
            setState(prev => ({ ...prev, isListening: true }));
            
            // Demander Wake Lock
            await requestWakeLock();
          }
        }
        
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          setState(prev => ({ 
            ...prev, 
            error: errorMessage,
            isInitialized: false 
          }));
          console.error('❌ Erreur init mobile:', error);
          setIsSupported(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      mounted = false;
    };
  }, [options.enabled, options.accessKey, options.modelPath, options.sensitivity, options.autoStart, handleWake, requestPermission, initAudioContext, requestWakeLock, runDiagnostic]);
  
  /**
   * Écouter visibilité
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
  
  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      // Libérer Wake Lock
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(console.error);
      }
      
      // Libérer AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
      
      // Libérer Porcupine
      releaseWakeWord().catch(console.error);
    };
  }, []);
  
  /**
   * Méthodes publiques
   */
  const start = useCallback(async (): Promise<boolean> => {
    const started = await startWakeWordListening();
    if (started) {
      setState(prev => ({ ...prev, isListening: true }));
      await requestWakeLock();
    }
    return started;
  }, [requestWakeLock]);
  
  const stop = useCallback(async (): Promise<void> => {
    await stopWakeWordListening();
    setState(prev => ({ ...prev, isListening: false }));
    
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
    }
  }, []);
  
  return {
    ...state,
    start,
    stop,
    requestPermission,
    isSupported,
    isMobile,
    platform,
    diagnosticInfo,
    fallbackMode
  };
}
