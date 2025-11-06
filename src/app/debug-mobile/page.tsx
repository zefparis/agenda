'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Page de diagnostic mobile pour déboguer les problèmes
 * Accès : /debug-mobile
 */
export default function DebugMobilePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [tests, setTests] = useState<any>({});
  const [swVersion, setSwVersion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    console.log(msg);
  };

  useEffect(() => {
    runInitialDiagnostics();
  }, []);

  const runInitialDiagnostics = async () => {
    addLog('🚀 Début du diagnostic mobile');

    // Test 1: Détection mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setTests((prev: any) => ({ ...prev, isMobile }));
    addLog(`📱 Appareil: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);

    // Test 2: HTTPS
    const isSecure = window.isSecureContext;
    setTests((prev: any) => ({ ...prev, isSecure }));
    addLog(`🔒 HTTPS: ${isSecure ? 'OUI' : 'NON'}`);

    // Test 3: Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sw = reg.active;
        if (sw) {
          // Essayer de récupérer la version depuis le SW
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'SW_VERSION') {
              setSwVersion(event.data.version);
              addLog(`📦 Service Worker: ${event.data.version}`);
            }
          });
          sw.postMessage({ type: 'GET_VERSION' });
        }
        setTests((prev: any) => ({ ...prev, swInstalled: true }));
        addLog('✅ Service Worker installé');
      } catch (error) {
        setTests((prev: any) => ({ ...prev, swInstalled: false }));
        addLog('❌ Service Worker: Erreur');
      }
    } else {
      setTests((prev: any) => ({ ...prev, swInstalled: false }));
      addLog('❌ Service Worker non supporté');
    }

    // Test 4: Fetch API
    setTests((prev: any) => ({ ...prev, hasFetch: typeof fetch !== 'undefined' }));
    addLog(`🌐 Fetch API: ${typeof fetch !== 'undefined' ? 'OUI' : 'NON'}`);

    // Test 5: ReadableStream
    setTests((prev: any) => ({ ...prev, hasStreams: typeof ReadableStream !== 'undefined' }));
    addLog(`🌊 Streaming: ${typeof ReadableStream !== 'undefined' ? 'OUI' : 'NON'}`);
  };

  const testChatAPI = async () => {
    setIsLoading(true);
    addLog('🧪 Test de l\'API Chat...');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const startTime = Date.now();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test simple' }],
          events: []
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const duration = Date.now() - startTime;
      addLog(`⏱️ Temps de réponse: ${duration}ms`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      addLog('✅ Connexion API OK');

      // Tester le streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Pas de reader disponible');
      }

      const decoder = new TextDecoder();
      let chunks = 0;
      let totalData = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        totalData += chunk;
        chunks++;
      }

      addLog(`✅ Streaming OK: ${chunks} chunks, ${totalData.length} caractères`);
      setTests((prev: any) => ({ ...prev, chatAPI: true }));

    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message}`);
      setTests((prev: any) => ({ ...prev, chatAPI: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const testOpenAI = async () => {
    setIsLoading(true);
    addLog('🤖 Test OpenAI complet...');

    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();

      if (data.success) {
        addLog('✅ OpenAI: Tous les tests passent');
        addLog(`   - Modèle: ${data.tests.models_config?.parsing_model}`);
        setTests((prev: any) => ({ ...prev, openAI: true }));
      } else {
        addLog('❌ OpenAI: Certains tests échouent');
        addLog(`   - ${data.message}`);
        setTests((prev: any) => ({ ...prev, openAI: false }));
      }
    } catch (error: any) {
      addLog(`❌ Erreur test OpenAI: ${error.message}`);
      setTests((prev: any) => ({ ...prev, openAI: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const clearServiceWorker = async () => {
    addLog('🗑️ Suppression des Service Workers...');
    
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.unregister();
        addLog('✅ Service Worker supprimé');
      }
      
      addLog('🔄 Rechargement de la page dans 2s...');
      setTimeout(() => location.reload(), 2000);
    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message}`);
    }
  };

  const clearAllCache = async () => {
    addLog('🗑️ Suppression de tous les caches...');
    
    try {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
        addLog(`✅ Cache supprimé: ${name}`);
      }
      
      addLog('✅ Tous les caches supprimés');
      addLog('🔄 Rechargement dans 2s...');
      setTimeout(() => location.reload(), 2000);
    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">🔍 Diagnostic Mobile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Debug des problèmes sur mobile/PWA
          </p>
        </div>

        {/* Tests Summary */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Tests Système</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <TestResult label="Mobile" status={tests.isMobile} />
            <TestResult label="HTTPS" status={tests.isSecure} />
            <TestResult label="Service Worker" status={tests.swInstalled} />
            <TestResult label="Fetch API" status={tests.hasFetch} />
            <TestResult label="Streaming" status={tests.hasStreams} />
            <TestResult label="Chat API" status={tests.chatAPI} />
            <TestResult label="OpenAI" status={tests.openAI} />
          </div>

          {swVersion && (
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <strong>Version SW:</strong> {swVersion}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={testChatAPI}
              disabled={isLoading}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Test en cours...' : '🧪 Tester l\'API Chat'}
            </button>

            <button
              onClick={testOpenAI}
              disabled={isLoading}
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Test en cours...' : '🤖 Tester OpenAI'}
            </button>

            <button
              onClick={clearServiceWorker}
              className="w-full p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
            >
              🗑️ Supprimer Service Worker
            </button>

            <button
              onClick={clearAllCache}
              className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              🗑️ Supprimer TOUS les Caches
            </button>

            <button
              onClick={() => location.reload()}
              className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
            >
              🔄 Recharger la Page
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Effacer
            </button>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-4">Aucun log</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="py-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestResult({ label, status }: { label: string; status?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <span className="font-medium">{label}</span>
      {status === undefined ? (
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      ) : status ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
    </div>
  );
}
