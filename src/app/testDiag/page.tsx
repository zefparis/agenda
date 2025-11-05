"use client";

import { useEffect, useState } from "react";

export default function TestDiag() {
  const [checks, setChecks] = useState({
    apiKey: { status: "⏳", message: "Vérification..." },
    model: { status: "⏳", message: "Vérification..." },
    modelSize: { status: "⏳", message: "Vérification..." },
    base64: { status: "⏳", message: "Vérification..." }
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      // 1. Vérifier la clé API
      const apiKey = process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY;
      if (!apiKey) {
        setChecks(prev => ({
          ...prev,
          apiKey: { status: "❌", message: "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY non définie" }
        }));
      } else if (apiKey.length < 20) {
        setChecks(prev => ({
          ...prev,
          apiKey: { status: "⚠️", message: `Clé API suspecte (${apiKey.length} caractères)` }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          apiKey: { status: "✅", message: `Clé API présente (${apiKey.length} caractères)` }
        }));
      }

      // 2. Vérifier le modèle
      try {
        const modelResponse = await fetch("/models/hello_benji.ppn");
        if (!modelResponse.ok) {
          setChecks(prev => ({
            ...prev,
            model: { status: "❌", message: `HTTP ${modelResponse.status}: ${modelResponse.statusText}` }
          }));
          return;
        }
        
        setChecks(prev => ({
          ...prev,
          model: { status: "✅", message: "Modèle accessible" }
        }));

        // 3. Vérifier la taille
        const modelArrayBuffer = await modelResponse.arrayBuffer();
        const size = modelArrayBuffer.byteLength;
        
        if (size < 1000) {
          setChecks(prev => ({
            ...prev,
            modelSize: { status: "❌", message: `Fichier trop petit: ${size} bytes` }
          }));
        } else {
          setChecks(prev => ({
            ...prev,
            modelSize: { status: "✅", message: `${size} bytes (${(size / 1024).toFixed(2)} KB)` }
          }));
        }

        // 4. Tester conversion base64
        try {
          const bytes = new Uint8Array(modelArrayBuffer);
          let binary = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
            binary += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const modelBase64 = btoa(binary);
          
          setChecks(prev => ({
            ...prev,
            base64: { status: "✅", message: `Conversion OK (${modelBase64.length} caractères)` }
          }));
        } catch (err) {
          setChecks(prev => ({
            ...prev,
            base64: { status: "❌", message: `Erreur conversion: ${err}` }
          }));
        }

      } catch (err) {
        setChecks(prev => ({
          ...prev,
          model: { status: "❌", message: `Erreur fetch: ${err}` }
        }));
      }
    };

    runDiagnostics();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-blue-900 to-neutral-900 text-white p-8">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          🔍 Diagnostic Porcupine
        </h1>
        
        <div className="space-y-4">
          {Object.entries(checks).map(([key, check]) => (
            <div 
              key={key}
              className="bg-black/30 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{check.status}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-300">{check.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <a 
            href="/testWake"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
          >
            → Test Wake Word
          </a>
          <a 
            href="/"
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            ← Accueil
          </a>
        </div>

        <div className="mt-8 bg-yellow-500/20 border border-yellow-500 rounded-xl p-4">
          <h3 className="font-bold text-yellow-400 mb-2">💡 Résolution des problèmes :</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>
              <strong>Clé API manquante :</strong> Ajoutez <code className="bg-black/50 px-1 rounded">NEXT_PUBLIC_PICOVOICE_ACCESS_KEY</code> dans <code className="bg-black/50 px-1 rounded">.env.local</code>
            </li>
            <li>
              <strong>Modèle introuvable :</strong> Vérifiez que <code className="bg-black/50 px-1 rounded">public/models/hello_benji.ppn</code> existe
            </li>
            <li>
              <strong>Conversion base64 échouée :</strong> Le fichier modèle pourrait être corrompu
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
