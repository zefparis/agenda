/**
 * Indicateur visuel d'activation vocale "Hello Benji"
 * Affiche une animation lumineuse autour du micro quand l'écoute est active
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Waves } from 'lucide-react';

interface WakeIndicatorProps {
  isListening: boolean;
  isWakeDetected: boolean;
  className?: string;
}

export function WakeIndicator({ isListening, isWakeDetected, className = '' }: WakeIndicatorProps) {
  return (
    <AnimatePresence>
      {(isListening || isWakeDetected) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`fixed bottom-24 right-8 z-50 ${className}`}
        >
          {/* Conteneur principal */}
          <div className="relative flex items-center justify-center">
            {/* Halos pulsants */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '120px', height: '120px' }}
            />

            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.2, 0.05, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
              style={{ width: '120px', height: '120px' }}
            />

            {/* Cercle central */}
            <motion.div
              className={`relative z-10 flex items-center justify-center rounded-full shadow-2xl ${
                isWakeDetected
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }`}
              animate={{
                scale: isWakeDetected ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isWakeDetected ? 2 : 0
              }}
              style={{ width: '80px', height: '80px' }}
            >
              {isWakeDetected ? (
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Waves className="w-10 h-10 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Mic className="w-10 h-10 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Ondes sonores animées */}
            {isListening && !isWakeDetected && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2 border-purple-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [0.8, 2, 2.5],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                    style={{ width: '80px', height: '80px' }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Texte d'état */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <motion.p
              className={`text-sm font-bold px-4 py-2 rounded-full shadow-lg ${
                isWakeDetected
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              }`}
              animate={{
                scale: isWakeDetected ? [1, 1.05, 1] : 1
              }}
              transition={{
                duration: 0.3,
                repeat: isWakeDetected ? 3 : 0
              }}
            >
              {isWakeDetected ? '✅ Détecté !' : '🎤 En écoute...'}
            </motion.p>
          </motion.div>

          {/* Indicateur "Dites Hello Benji" */}
          {isListening && !isWakeDetected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-2 text-center"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Dites "Hello Benji"
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
