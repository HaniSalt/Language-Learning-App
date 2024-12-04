// src/ShareTarget/ShareTargetHandler.tsx

import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { importDecks, Deck } from '../utils/storage';

export const ShareTargetHandler: FunctionalComponent = () => {
  useEffect(() => {
    // Check if the browser supports the Filesystem Access API
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files.length) {
          return;
        }
        for (const handle of launchParams.files) {
          const file = await handle.getFile();
          if (file.type === 'application/json') {
            const text = await file.text();
            try {
              const data = JSON.parse(text) as Deck[];
              importDecks(data);
              alert('Decks imported via share target!');
            } catch (error) {
              alert('Failed to import shared decks.');
            }
          }
        }
      });
    }
  }, []);

  return (
    <div>
      <h2>Processing Shared Deck...</h2>
    </div>
  );
};
