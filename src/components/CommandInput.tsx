'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceInput } from './VoiceInput';

interface CommandInputProps {
  onCommandSubmit: (command: string) => Promise<void>;
}

export function CommandInput({ onCommandSubmit }: CommandInputProps) {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!command.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onCommandSubmit(command);
      setCommand('');
    } catch (error) {
      console.error('Error submitting command:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    console.log('🎤 Voice command received:', transcript);
    setCommand(transcript);
    
    // Soumettre automatiquement après transcription
    setTimeout(async () => {
      setIsLoading(true);
      try {
        await onCommandSubmit(transcript);
        setCommand('');
      } catch (error) {
        console.error('Error submitting voice command:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-700"
      >
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Ex: rdv demain 17h 🎤"
            className="flex-1 min-w-0 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          
          {/* Voice Input Button */}
          <div className="flex-shrink-0">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!command.trim() || isLoading}
            className="flex-shrink-0 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Traitement...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Envoyer</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.form>
  );
}
