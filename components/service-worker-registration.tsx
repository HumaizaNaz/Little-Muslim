'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
          });
          console.log('[v0] Service Worker registered successfully:', registration);
        } catch (error) {
          console.log('[v0] Service Worker registration failed:', error);
        }
      });
    }
  }, []);

  return null;
}
