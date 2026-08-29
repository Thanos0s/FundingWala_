import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';

export const useEventListener = () => {
  const [events, setEvents] = useState([]);
  const [listenerId, setListenerId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const subscribe = useCallback((eventType = 'mint') => {
    if (isListening) return;

    const id = eventService.subscribeToMintEvents((event) => {
      setEvents((prev) => [event, ...prev]);
    });

    setListenerId(id);
    setIsListening(true);

    return id;
  }, [isListening]);

  const unsubscribe = useCallback((id = null) => {
    const idToUnsubscribe = id || listenerId;
    if (idToUnsubscribe) {
      eventService.unsubscribe(idToUnsubscribe);
      setListenerId(null);
      setIsListening(false);
    }
  }, [listenerId]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    return () => {
      if (listenerId && isListening) {
        unsubscribe(listenerId);
      }
    };
  }, [listenerId, isListening, unsubscribe]);

  return {
    events,
    listenerId,
    isListening,
    subscribe,
    unsubscribe,
    clearEvents,
  };
};
