"use client";

import { useEffect, useState } from "react";
import { PorcupineWorker } from "@picovoice/porcupine-web";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

export default function TestWake() {
  const [status, setStatus] = useState("⏳ Initialisation…");
  const [detected, setDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let porcupineInstance: PorcupineWorker | null = null;

    const initPorcupine = async () => {
      try {
        const accessKey = process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY;
        
        if (!accessKey) {
          setError("❌ NEXT_PUBLIC_PICOVOICE_ACCESS_KEY non configurée");
          setStatus("❌ Clé API manquante");
          return;
        }

        setStatus("🔧 Chargement du modèle…");

        // Charger le modèle en tant que base64
        console.log('📥 Fetching model from /models/hello_benji.ppn');
        const modelResponse = await fetch("/models/hello_benji.ppn");
        if (!modelResponse.ok) {
          throw new Error(`Impossible de charger le modèle: ${modelResponse.status} ${modelResponse.statusText}`);
        }
        
        const modelArrayBuffer = await modelResponse.arrayBuffer();
        console.log(`✅ Model loaded: ${modelArrayBuffer.byteLength} bytes`);
        
        // Conversion base64 robuste pour données binaires
        const bytes = new Uint8Array(modelArrayBuffer);
        let binary = '';
        const chunkSize = 0x8000; // 32KB chunks to avoid call stack size exceeded
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        const modelBase64 = btoa(binary);
        console.log(`✅ Base64 encoded: ${modelBase64.length} characters`);

        // Créer l'instance Porcupine avec le modèle en base64
        porcupineInstance = await PorcupineWorker.create(
          accessKey,
          [
            {
              label: "hello_benji",
              base64: modelBase64,
              sensitivity: 0.5
            }
          ],
          (detection) => {
            console.log("🔥 Hello Benji détecté !", detection);
            setDetected(true);
            setTimeout(() => setDetected(false), 2000);
          },
          {} // Options du modèle (utilise les valeurs par défaut)
        );

        setStatus("🎧 En écoute du mot-clé : Hello Benji");

        // Démarrer l'écoute avec WebVoiceProcessor
        await WebVoiceProcessor.subscribe(porcupineInstance);

      } catch (err) {
        console.error("❌ Erreur Porcupine :", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setStatus("❌ Erreur d'initialisation");
      }
    };

    initPorcupine();

    // Cleanup
    return () => {
      if (porcupineInstance) {
        WebVoiceProcessor.unsubscribe(porcupineInstance).catch(console.error);
        porcupineInstance.release().catch(console.error);
      }
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900 to-neutral-900 text-white p-8">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🎤 Test Wake Word "Hello Benji"
        </h1>
        
        <div className="mb-8 text-center">
          <div className={`text-xl mb-4 ${error ? 'text-red-400' : 'text-gray-200'}`}>
            {status}
          </div>
          
          {detected && (
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <div className="animate-ping absolute w-24 h-24 rounded-full bg-green-400 opacity-75"></div>
                <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400 animate-pulse">
                Wake Word Détecté !
              </p>
            </div>
          )}

          {!detected && !error && (
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <div className="animate-pulse absolute w-20 h-20 rounded-full bg-purple-400 opacity-30"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl">🎤</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-purple-300">📋 Instructions :</h2>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Autorisez l'accès au microphone si demandé</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Attendez que le statut indique "En écoute"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Dites clairement : <strong>"Hello Benji"</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Observez l'animation de confirmation ✅</span>
            </li>
          </ol>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-red-400 mb-2">❌ Erreur détaillée :</h3>
            <pre className="text-xs text-red-300 whitespace-pre-wrap break-words">
              {error}
            </pre>
          </div>
        )}

        <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4">
          <h3 className="font-bold text-blue-400 mb-2">💡 Dépannage :</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Vérifiez que <code className="bg-black/50 px-1 rounded">NEXT_PUBLIC_PICOVOICE_ACCESS_KEY</code> est dans .env.local</li>
            <li>• Assurez-vous que <code className="bg-black/50 px-1 rounded">hello_benji.ppn</code> est dans public/models/</li>
            <li>• Ouvrez la console (F12) pour voir les logs détaillés</li>
            <li>• Ajustez la sensibilité si nécessaire (actuellement 0.5)</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            ← Retour à l'application
          </a>
        </div>
      </div>

      {/* Console de logs en temps réel */}
      <div className="mt-8 max-w-2xl w-full bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-mono text-green-400 mb-2">📡 Logs Console :</h3>
        <p className="text-xs text-gray-400 font-mono">
          Ouvrez la console navigateur (F12) pour voir les logs détaillés
        </p>
      </div>
    </main>
  );
}
