# 🎤 Guide du Mode Conversation Continue

## Nouveautés

### ✨ Mode Conversation Continue
L'application dispose maintenant d'un **mode conversation continue** similaire à l'interface OpenAI, permettant une interaction vocale fluide sans avoir à appuyer sur un bouton à chaque fois.

## Fonctionnalités

### 1. **Mode Conversation Continue** 🔄
- **Activation**: Cliquez sur le bouton "Mode Continu" (icône Volume avec indication verte)
- **Écoute permanente**: Le système écoute en continu après activation
- **Détection automatique**: Détecte automatiquement la fin de votre phrase (1.5s de silence)
- **Pause intelligente**: L'écoute se met en pause quand l'assistant répond
- **Reprise automatique**: Redémarre l'écoute après chaque réponse

### 2. **Bouton Vocal Classique** 🎙️
- **Usage ponctuel**: Pour une seule commande vocale
- **Contrôle manuel**: Appuyez pour parler, relâchez pour arrêter
- Reste disponible si vous préférez le mode manuel

### 3. **Améliorations de Vitesse** ⚡
- Suppression du délai artificiel de 100ms
- Soumission immédiate des transcriptions
- Streaming GPT-5 optimisé
- Réponses plus rapides (< 2 secondes en général)

## Comment Utiliser

### Mode Conversation Continue
```
1. Cliquez sur le bouton "Mode Continu" (vert quand activé)
2. Parlez naturellement
3. Attendez 1.5s de silence après avoir fini votre phrase
4. Le message est automatiquement envoyé
5. L'assistant répond
6. L'écoute reprend automatiquement
7. Continuez la conversation sans cliquer !
```

### Indicateurs Visuels
- **Point rouge clignotant**: Le système vous écoute
- **Texte en vert**: Affiche ce que vous dites en temps réel
- **Bouton vert**: Mode continu activé
- **Bouton gris**: Mode continu désactivé

## Conseils d'Utilisation

### Pour une Meilleure Reconnaissance
✅ **Recommandé**:
- Parlez clairement et à un rythme normal
- Attendez 1.5s de silence après votre phrase
- Utilisez un microphone de qualité
- Environnement calme si possible

❌ **À Éviter**:
- Parler trop vite
- Continuer sans pause (le système attend un silence)
- Environnements très bruyants

### Quand Utiliser Quel Mode?

**Mode Continu** 🔄
- Conversations longues avec plusieurs échanges
- Brainstorming ou planning
- Quand vous avez les mains occupées
- Sessions de productivité

**Mode Vocal Classique** 🎙️
- Commandes ponctuelles rapides
- Environnements bruyants (meilleur contrôle)
- Si vous préférez le contrôle manuel

**Saisie Texte** ⌨️
- Commandes complexes ou techniques
- Quand le vocal n'est pas approprié
- Copier-coller d'informations

## Paramètres Techniques

### Configuration GPT-5
- Modèle: `gpt-5` (le plus performant)
- Max tokens: 2000
- Streaming: Activé
- Temperature: Par défaut (1)

### Reconnaissance Vocale
- Langue: Français (fr-FR)
- Mode continu: `continuous: true`
- Résultats intermédiaires: Activés
- Délai de silence: 1500ms

## Dépannage

### Le mode continu ne démarre pas
- Vérifiez les permissions du microphone dans votre navigateur
- Rechargez la page
- Essayez avec Chrome/Edge (meilleure compatibilité)

### L'écoute s'arrête tout le temps
- Augmentez le volume de votre voix
- Vérifiez que votre micro fonctionne
- Essayez dans un environnement plus calme

### Les réponses sont lentes
- Vérifiez votre connexion internet
- GPT-5 devrait répondre en 1-3 secondes normalement
- Le streaming affiche les réponses au fur et à mesure

## Compatibilité

### Navigateurs Supportés
- ✅ Chrome / Chromium
- ✅ Edge
- ✅ Safari (macOS/iOS)
- ⚠️ Firefox (support limité de Web Speech API)

### Appareils
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (Android, iOS)
- ⚠️ Nécessite un microphone fonctionnel

## Retours et Suggestions

Le mode conversation continue est une nouvelle fonctionnalité. N'hésitez pas à remonter vos retours pour l'améliorer !
