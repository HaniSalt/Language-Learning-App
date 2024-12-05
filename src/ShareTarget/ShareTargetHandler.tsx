import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { importDecks, Deck } from '../utils/storage';

// ShareTargetHandler component definition
export const ShareTargetHandler: FunctionalComponent = () => {
  // Effect hook to handle shared files when the component mounts
  useEffect(() => {
    // Checks if the browser supports the File System Access API's launchQueue
    if ('launchQueue' in window) {
      // Sets a consumer for the launchQueue to handle incoming shared files
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files.length) {
          return;
        }
        // Iterates over the shared files
        for (const handle of launchParams.files) {
          const file = await handle.getFile();
          // Checks if the file is a JSON file
          if (file.type === 'application/json') {
            const text = await file.text();
            try {
              const data = JSON.parse(text) as Deck[];
              importDecks(data); // Imports the decks from the shared file
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
