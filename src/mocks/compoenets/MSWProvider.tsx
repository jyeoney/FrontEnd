'use client';

import { useEffect } from 'react';

export function MSWProvider() {
  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        });
      }
    };

    initMSW().catch(console.error);

    return () => {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        navigator.serviceWorker?.controller?.postMessage({
          type: 'CLEAN_UP',
        });
      }
    };
  }, []);

  return null;
}
