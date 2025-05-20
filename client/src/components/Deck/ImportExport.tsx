import { FunctionalComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { importDecksApi, exportDecksApi, Deck } from '../../utils/deckApi';
import './importExportStyles.less';
import { getAuth } from 'firebase/auth'; // To get current user UID

interface ImportExportProps {
  onDecksChanged: () => void; // Callback to refresh deck list after import
}

export const ImportExport: FunctionalComponent<ImportExportProps> = ({ onDecksChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleImport = async () => {
    if (!currentUser) {
      alert('You must be logged in to import decks.');
      return;
    }
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedDecksData = JSON.parse(e.target?.result as string) as Deck[];
          await importDecksApi(importedDecksData, currentUser.uid);
          alert('Decks imported successfully!');
          onDecksChanged(); // Trigger refresh in parent component
          if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        } catch (error: any) {
          console.error('Import error:', error);
          alert(`Failed to import decks. ${error.response?.data?.message || error.message || 'Invalid file format or server error.'}`);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file to import.');
    }
  };

  const handleExport = async () => {
    if (!currentUser) {
      alert('You must be logged in to export decks.');
      return;
    }
    try {
      const userDecks = await exportDecksApi(currentUser.uid);
      const dataStr = JSON.stringify(userDecks, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my_decks.json';
      link.click();
      URL.revokeObjectURL(url); // Clean up
    } catch (error: any) {
      console.error('Export error:', error);
      alert(`Failed to export decks. ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div class="import-export">
      <h2>Import/Export Decks</h2>
      <div class="import-section">
        <input type="file" ref={fileInputRef} accept=".json" />
        <button onClick={handleImport} disabled={!currentUser}>Import Decks</button>
      </div>
      <div class="export-section">
        <button onClick={handleExport} disabled={!currentUser}>Export Decks</button>
      </div>
    </div>
  );
};