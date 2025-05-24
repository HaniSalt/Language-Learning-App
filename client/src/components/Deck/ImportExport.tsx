import { FunctionalComponent } from 'preact';
import { useRef } from 'preact/hooks';
// Import Deck type from your central types file
import type { Deck } from '../../types';
// Import API functions
import { importDecksApi, exportDecksApi } from '../../utils/deckApi';
import './importExportStyles.less';
// No longer need getAuth here if userId is passed as a prop

interface ImportExportProps {
  userId: string; // Accept userId as a prop
  onDecksChanged: () => void; // Callback to refresh deck list after import
}

export const ImportExport: FunctionalComponent<ImportExportProps> = ({ userId, onDecksChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!userId) { // Check the userId prop
      alert('User ID is not available. You might need to log in again.');
      return;
    }
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedDecksData = JSON.parse(e.target?.result as string);
          // Validate if importedDecksData is an array of Decks (basic check)
          if (!Array.isArray(importedDecksData)) {
            throw new Error("Invalid file format: Expected an array of decks.");
          }
          // Further validation of deck structure could be added here if needed

          // The importDecksApi expects decks without userId, as it's passed separately.
          // Ensure the imported Deck structure matches Omit<Deck, 'userId'> or adapt.
          const decksToImport: Array<Omit<Deck, 'userId'>> = importedDecksData.map(deck => {
            const { userId: _discardUserId, ...restOfDeck } = deck; // eslint-disable-line @typescript-eslint/no-unused-vars
            return restOfDeck;
          });


          await importDecksApi(decksToImport, userId); // Use the userId prop
          alert('Decks imported successfully!');
          onDecksChanged(); // Trigger refresh in parent component
          if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        } catch (error: any) {
          console.error('Import error:', error);
          alert(`Failed to import decks. ${error.message || 'Invalid file format or server error.'}`);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file to import.');
    }
  };

  const handleExport = async () => {
    if (!userId) { // Check the userId prop
      alert('User ID is not available. You might need to log in again.');
      return;
    }
    try {
      const userDecks = await exportDecksApi(userId); // Use the userId prop
      const dataStr = JSON.stringify(userDecks, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my_decks.json'; // You can customize the filename
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Clean up
    } catch (error: any) {
      console.error('Export error:', error);
      alert(`Failed to export decks. ${error.message || 'An unknown error occurred.'}`);
    }
  };

  return (
    <div class="import-export">
      <h2>Import/Export Decks</h2>
      <div class="import-section">
        <h3>Import from File</h3>
        <input type="file" ref={fileInputRef} accept=".json" />
        {/* Disable button if userId is not available */}
        <button onClick={handleImport} disabled={!userId}>Import Decks</button>
        <p class="note">Select a JSON file containing an array of decks.</p>
      </div>
      <div class="export-section">
        <h3>Export Your Decks</h3>
        {/* Disable button if userId is not available */}
        <button onClick={handleExport} disabled={!userId}>Export All My Decks</button>
        <p class="note">This will download a JSON file of all your current decks.</p>
      </div>
    </div>
  );
};