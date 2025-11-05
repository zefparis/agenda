/**
 * Types pour le système d'activation vocale "Hello Benji"
 */

export interface WakeWordState {
  isInitialized: boolean;
  isListening: boolean;
  isWakeDetected: boolean;
  error: string | null;
}

export interface WakeWordConfig {
  accessKey: string;
  modelPath: string;
  sensitivity?: number;
}

export interface WakeWordCallbacks {
  onWake: () => void;
  onError?: (error: Error) => void;
  onInit?: () => void;
}
