'use client';

import { useEffect, useRef, useState } from 'react';
import { Event } from '@/types';

export function useNotifications(events: Event[]) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const notifiedEvents = useRef(new Set<string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Demander la permission pour les notifications
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission);
      }
    }
  }, []);

  // Créer le son de notification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Créer un son simple avec Web Audio API
      audioRef.current = new Audio();
      // Utiliser un data URL pour un son de notification simple
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuByvHVizcIGGS56+OSUAwbZLfn4ptSDAkeb8rxZpBxSxZMb8rzkXs5CxE7dMjtklgRDi6Dzuefcx4LJW+99H6FZSEPLnHK77BjHQUidb3vgGUfDyFqxfCAZS0IH2W78H5kLgggasXxf2QrCR5nuvGAZC0IH2S98X5lKwkfZ7zxfmQrCB9mvfF+ZSsJH2a88X9kKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHma88n9lKwkeZrzyf2UrCR5mvPJ/ZSsJHg==';
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Vérifier les événements à venir
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const in5Minutes = new Date(now.getTime() + 5 * 60 * 1000);
      const in15Minutes = new Date(now.getTime() + 15 * 60 * 1000);

      events.forEach((event) => {
        const eventDate = new Date(event.start_date);
        const eventId = event.id;

        // Ne pas notifier si déjà fait
        if (notifiedEvents.current.has(eventId)) return;

        // Ne pas notifier les événements passés ou complétés
        if (eventDate < now || event.status === 'completed') return;

        // Notifier 15 minutes avant (pour reminder)
        if (event.type === 'reminder' && eventDate <= in15Minutes && eventDate > now) {
          showNotification(event, '15 minutes');
          notifiedEvents.current.add(eventId);
          return;
        }

        // Notifier 5 minutes avant (pour events)
        if (event.type === 'event' && eventDate <= in5Minutes && eventDate > now) {
          showNotification(event, '5 minutes');
          notifiedEvents.current.add(eventId);
          return;
        }

        // Notifier à l'heure exacte pour les tâches importantes
        if (event.type === 'task' && event.priority === 'high') {
          const diffMs = eventDate.getTime() - now.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          
          if (diffMins <= 5 && diffMins >= 0) {
            showNotification(event, 'maintenant');
            notifiedEvents.current.add(eventId);
          }
        }
      });
    };

    const showNotification = (event: Event, timing: string) => {
      // Jouer le son
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }

      // Notification navigateur
      if (permission === 'granted') {
        const notification = new Notification(`🔔 ${event.title}`, {
          body: `Dans ${timing} - ${event.type === 'event' ? 'Événement' : event.type === 'task' ? 'Tâche' : 'Rappel'}`,
          icon: '/icon.png',
          badge: '/icon.png',
          tag: event.id,
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }

      // Log pour debugging
      console.log(`🔔 Notification: ${event.title} dans ${timing}`);
    };

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkNotifications, 30000);
    checkNotifications(); // Vérifier immédiatement

    return () => clearInterval(interval);
  }, [events, permission]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  };

  return { permission, requestPermission };
}
