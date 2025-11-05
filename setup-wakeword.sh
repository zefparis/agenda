#!/bin/bash

# Script de configuration du système d'activation vocale "Hello Benji"
# Pour mon-agenda-intelligent

echo "🎤 Configuration du système Wake Word Hello Benji"
echo "=================================================="
echo ""

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p public/models
mkdir -p public/porcupine

echo "✅ Dossiers créés"
echo ""
echo "ℹ️  Note : Les fichiers WASM de Porcupine sont téléchargés"
echo "   automatiquement depuis le CDN Picovoice au premier démarrage."

echo ""
echo "✅ Configuration de base terminée !"
echo ""
echo "⚠️  ÉTAPES RESTANTES :"
echo ""
echo "1. Obtenir une clé Picovoice :"
echo "   → https://console.picovoice.ai/"
echo ""
echo "2. Créer un modèle personnalisé 'Hello Benji' :"
echo "   → https://console.picovoice.ai/ppn"
echo "   → Phrase: 'Hello Benji'"
echo "   → Langage: Français"
echo "   → Plateforme: Web (WASM)"
echo ""
echo "3. Télécharger le fichier .ppn et le placer dans :"
echo "   → public/models/hello_benji.ppn"
echo ""
echo "4. Ajouter votre clé dans .env.local :"
echo "   NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=your_key_here"
echo ""
echo "📖 Documentation complète : WAKE_WORD_SETUP.md"
echo ""
