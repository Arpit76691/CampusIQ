import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WSContext = createContext(null);

export function WSProvider({ children }) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const subscriptionsRef = useRef({});

  const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8085';

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('[WSContext] Connected to STOMP');
        setConnected(true);
      },
      onDisconnect: () => {
        console.log('[WSContext] Disconnected from STOMP');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('[WSContext] STOMP error:', frame);
        setConnected(false);
      },
    });

    try {
      client.activate();
    } catch (err) {
      console.warn('[WSContext] Could not connect to WebSocket:', err.message);
    }

    clientRef.current = client;

    return () => {
      if (clientRef.current && clientRef.current.active) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  /**
   * Subscribe to a STOMP topic.
   * @param {string} topic - e.g. '/topic/leaderboard/1'
   * @param {function} callback - called with parsed JSON message body
   * @returns {function} unsubscribe function
   */
  function subscribe(topic, callback) {
    if (!clientRef.current) return () => {};

    const doSubscribe = () => {
      const sub = clientRef.current.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch {
          callback(message.body);
        }
      });
      subscriptionsRef.current[topic] = sub;
    };

    if (clientRef.current.connected) {
      doSubscribe();
    } else {
      // Queue subscription for when connection is ready
      const originalOnConnect = clientRef.current.onConnect;
      clientRef.current.onConnect = (frame) => {
        if (originalOnConnect) originalOnConnect(frame);
        doSubscribe();
      };
    }

    return () => {
      const sub = subscriptionsRef.current[topic];
      if (sub) {
        sub.unsubscribe();
        delete subscriptionsRef.current[topic];
      }
    };
  }

  /**
   * Subscribe to a contest's leaderboard topic.
   * @param {number|string} contestId
   * @param {function} callback
   * @returns {function} unsubscribe function
   */
  function subscribeToLeaderboard(contestId, callback) {
    return subscribe(`/topic/leaderboard/${contestId}`, callback);
  }

  return (
    <WSContext.Provider value={{ connected, subscribe, subscribeToLeaderboard }}>
      {children}
    </WSContext.Provider>
  );
}

export function useWS() {
  return useContext(WSContext);
}
