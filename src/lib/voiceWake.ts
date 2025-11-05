/**
 * Système d'activation vocale "Hello Benji"
 * Utilise Porcupine Web pour la détection locale du mot-clé
 */

import { PorcupineWorker } from '@picovoice/porcupine-web';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import type { WakeWordConfig, WakeWordCallbacks } from '@/types/wakeword';

let porcupineInstance: PorcupineWorker | null = null;
let isInitialized = false;
let isListening = false;

/**
 * Initialise Porcupine pour la détection du mot-clé "Hello Benji"
 * @param config Configuration (clé API, chemin du modèle, sensibilité)
 * @param callbacks Callbacks pour les événements
 * @returns Instance Porcupine ou null en cas d'erreur
 */
export async function initWakeWord(
  config: WakeWordConfig,
  callbacks: WakeWordCallbacks
): Promise<PorcupineWorker | null> {
  try {
    // Si déjà initialisé, retourner l'instance existante
    if (porcupineInstance && isInitialized) {
      console.log('🎙️ Porcupine déjà initialisé');
      return porcupineInstance;
    }

    console.log('🎙️ Initialisation de Porcupine...');
    console.log('🔧 Chargement du modèle depuis:', config.modelPath);

    // Charger le modèle en base64 (plus fiable que publicPath)
    const modelResponse = await fetch(config.modelPath);
    if (!modelResponse.ok) {
      throw new Error(`Impossible de charger le modèle: ${config.modelPath}`);
    }
    
    const modelArrayBuffer = await modelResponse.arrayBuffer();
    console.log(`✅ Modèle chargé: ${modelArrayBuffer.byteLength} bytes`);
    
    // Conversion base64 robuste pour données binaires
    const bytes = new Uint8Array(modelArrayBuffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks to avoid call stack size exceeded
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const modelBase64 = btoa(binary);
    
    console.log('✅ Modèle converti en base64');

    // Créer une instance Porcupine avec le modèle en base64
    porcupineInstance = await PorcupineWorker.create(
      config.accessKey,
      [
        {
          label: 'hello-benji',
          base64: modelBase64,  // Utilisation de base64 au lieu de publicPath
          sensitivity: config.sensitivity || 0.5
        }
      ],
      // Callback de détection
      (detection) => {
        console.log('🔥 Wake word détecté: "Hello Benji"', detection);
        callbacks.onWake();
      },
      // Modèle Porcupine français (fichier .pv)
      { publicPath: '/models/porcupine_params_fr.pv' },
      // Options
      {}
    );

    isInitialized = true;
    console.log('✅ Porcupine initialisé avec succès');

    if (callbacks.onInit) {
      callbacks.onInit();
    }

    return porcupineInstance;
  } catch (error) {
    console.error('❌ Erreur initialisation Porcupine:', error);
    isInitialized = false;
    
    if (callbacks.onError) {
      callbacks.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
    
    return null;
  }
}

/**
 * Démarre l'écoute du mot-clé
 */
export async function startWakeWordListening(): Promise<boolean> {
  if (!porcupineInstance || !isInitialized) {
    console.warn('⚠️ Porcupine non initialisé');
    return false;
  }

  if (isListening) {
    console.log('🎧 Déjà en écoute');
    return true;
  }

  try {
    await WebVoiceProcessor.subscribe(porcupineInstance);
    isListening = true;
    console.log('🎧 Écoute du wake word activée');
    return true;
  } catch (error) {
    console.error('❌ Erreur démarrage écoute:', error);
    return false;
  }
}

/**
 * Arrête l'écoute du mot-clé
 */
export async function stopWakeWordListening(): Promise<void> {
  if (!porcupineInstance || !isListening) {
    return;
  }

  try {
    await WebVoiceProcessor.unsubscribe(porcupineInstance);
    isListening = false;
    console.log('⏸️ Écoute du wake word mise en pause');
  } catch (error) {
    console.error('❌ Erreur arrêt écoute:', error);
  }
}

/**
 * Libère les ressources Porcupine
 */
export async function releaseWakeWord(): Promise<void> {
  if (!porcupineInstance) {
    return;
  }

  try {
    await porcupineInstance.release();
    porcupineInstance = null;
    isInitialized = false;
    console.log('🗑️ Porcupine libéré');
  } catch (error) {
    console.error('❌ Erreur libération Porcupine:', error);
  }
}

/**
 * Vérifie si Porcupine est initialisé
 */
export function isWakeWordReady(): boolean {
  return isInitialized && porcupineInstance !== null;
}

/**
 * Fallback: détection manuelle (pour dev/test)
 * Simule la détection du wake word
 */
export function simulateWakeWord(callback: () => void): void {
  console.log('🔔 Simulation wake word "Hello Benji"');
  callback();
}
