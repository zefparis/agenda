'use client';

import { useState } from 'react';
import { MicrophoneFallback } from '@/components/MicrophoneFallback';
import { useWakeWordMobile } from '@/hooks/useWakeWordMobile';
import { WakeIndicator } from '@/components/WakeIndicator';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Page de test pour le système de fallback microphone
 * Permet de tester les différentes stratégies d'affichage
 */
export default function TestMicFallbackPage() {
  const [transcript, setTranscript] = useState<string>('');
  const [strategy, setStrategy] = useState<'auto' | 'both' | 'toggle'>('auto');
  const [useWakeWord, setUseWakeWord] = useState(true);

  // Hook wake word mobile
  const wakeWordMobile = useWakeWordMobile({
    accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY || '',
    modelPath: '/models/hello_benji.ppn',
    sensitivity: 0.5,
    enabled: strategy === 'toggle' ? useWakeWord : true,
    autoStart: false,
    onWake: () => {
      console.log('🔥 Wake word détecté!');
      setTranscript('Wake word détecté! Parlez maintenant...');
    },
    onError: (error) => {
      console.error('❌ Erreur wake word:', error);
    }
  });

  const handleTranscript = (text: string) => {
    console.log('📝 Transcript reçu:', text);
    setTranscript(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Test Microphone Fallback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test des différentes stratégies d'accès au microphone sur PWA mobile
          </p>
        </div>

        {/* Sélection de stratégie */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Stratégie d'Affichage</h2>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="strategy"
                value="auto"
                checked={strategy === 'auto'}
                onChange={(e) => setStrategy(e.target.value as 'auto')}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">Fallback Automatique (Recommandé)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Affiche le fallback si le wake word ne peut pas s'initialiser
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="strategy"
                value="both"
                checked={strategy === 'both'}
                onChange={(e) => setStrategy(e.target.value as 'both')}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">Les Deux Options (UX Optimale)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Affiche wake word ET fallback manuel simultanément
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="strategy"
                value="toggle"
                checked={strategy === 'toggle'}
                onChange={(e) => setStrategy(e.target.value as 'toggle')}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">Toggle Utilisateur</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Laisser l'utilisateur choisir entre wake word et manuel
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Diagnostic */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Diagnostic Système</h2>
          
          <div className="space-y-3">
            <DiagnosticRow 
              label="Contexte sécurisé (HTTPS)"
              status={wakeWordMobile.diagnosticInfo.isSecureContext}
            />
            <DiagnosticRow 
              label="getUserMedia disponible"
              status={wakeWordMobile.diagnosticInfo.hasGetUserMedia}
            />
            <DiagnosticRow 
              label="AudioContext disponible"
              status={wakeWordMobile.diagnosticInfo.hasAudioContext}
            />
            {wakeWordMobile.diagnosticInfo.audioContextState && (
              <DiagnosticRow 
                label="État AudioContext"
                status={wakeWordMobile.diagnosticInfo.audioContextState === 'running'}
                info={wakeWordMobile.diagnosticInfo.audioContextState}
              />
            )}
            {wakeWordMobile.diagnosticInfo.permissionState && (
              <DiagnosticRow 
                label="Permission microphone"
                status={wakeWordMobile.diagnosticInfo.permissionState === 'granted'}
                info={wakeWordMobile.diagnosticInfo.permissionState}
              />
            )}
            
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Mode Fallback</span>
                {wakeWordMobile.fallbackMode ? (
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">ACTIVÉ</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">DÉSACTIVÉ</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!wakeWordMobile.diagnosticInfo.isSecureContext && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Contexte non sécurisé détecté</div>
                  <div className="text-sm mt-1">
                    Le microphone nécessite HTTPS. Utilisez <code className="bg-red-200 dark:bg-red-800 px-1 rounded">https://</code> ou <code className="bg-red-200 dark:bg-red-800 px-1 rounded">localhost</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interface selon stratégie */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Interface Microphone</h2>
          
          {/* Stratégie 1 : Auto */}
          {strategy === 'auto' && (
            <div>
              {wakeWordMobile.fallbackMode ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Le wake word ne peut pas s'initialiser. Utilisation du fallback manuel.
                  </p>
                  <MicrophoneFallback onTranscript={handleTranscript} />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Dites "Hello Benji" pour activer la commande vocale
                  </p>
                  <WakeIndicator 
                    isListening={wakeWordMobile.isListening}
                    isWakeDetected={wakeWordMobile.isWakeDetected}
                  />
                </div>
              )}
            </div>
          )}

          {/* Stratégie 2 : Both */}
          {strategy === 'both' && (
            <div className="space-y-6">
              {!wakeWordMobile.fallbackMode && (
                <div>
                  <h3 className="font-semibold mb-2">Option 1 : Mode mains libres</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Dites "Hello Benji"
                  </p>
                  <WakeIndicator 
                    isListening={wakeWordMobile.isListening}
                    isWakeDetected={wakeWordMobile.isWakeDetected}
                  />
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">
                  {wakeWordMobile.fallbackMode ? 'Commande vocale' : 'Option 2 : Commande manuelle'}
                </h3>
                <MicrophoneFallback onTranscript={handleTranscript} />
              </div>
            </div>
          )}

          {/* Stratégie 3 : Toggle */}
          {strategy === 'toggle' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setUseWakeWord(!useWakeWord)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {useWakeWord ? '🎤 Passer au bouton micro' : '🎙️ Activer "Hello Benji"'}
                </button>
              </div>

              {useWakeWord && !wakeWordMobile.fallbackMode ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Dites "Hello Benji"
                  </p>
                  <WakeIndicator 
                    isListening={wakeWordMobile.isListening}
                    isWakeDetected={wakeWordMobile.isWakeDetected}
                  />
                </div>
              ) : (
                <MicrophoneFallback onTranscript={handleTranscript} />
              )}
            </div>
          )}
        </div>

        {/* Résultat */}
        {transcript && (
          <div className="p-6 bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-green-800 dark:text-green-200">
              Transcript Reçu
            </h2>
            <p className="text-lg text-green-900 dark:text-green-100">
              {transcript}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant de ligne de diagnostic
 */
function DiagnosticRow({ 
  label, 
  status, 
  info 
}: { 
  label: string; 
  status: boolean; 
  info?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {info && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {info}
          </span>
        )}
        {status ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
      </div>
    </div>
  );
}
