import { FunctionalComponent } from 'preact';
import { importDecks, exportDecks, Deck } from '../utils/storage';
import { useRef } from 'preact/hooks';
import './importExportStyles.less';

export const ImportExport: FunctionalComponent = () => {
  // Reference to the file input element for importing decks
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles the import of decks from a selected JSON file
  const handleImport = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as Deck[];
          importDecks(data); // Imports the decks into storage
          alert('Decks imported successfully!');
        } catch (error) {
          alert('Failed to import decks. Invalid file format.');
        }
      };
      reader.readAsText(file); // Reads the file as text
    }
  };

  // Handles the export of decks by generating and downloading a JSON file
  const handleExport = () => {
    const dataStr = exportDecks(); // Retrieves all decks as a JSON string
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Creates a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decks.json'; // Filename for the exported file
    link.click(); // Initiates the download
  };

  return (
    <div class="import-export">
      <h2>Import/Export Decks</h2>
      {/* Section for importing decks */}
      <div class="import-section">
        <input type="file" ref={fileInputRef} accept=".json" />
        <button onClick={handleImport}>Import Decks</button>
      </div>
      {/* Section for exporting decks */}
      <div class="export-section">
        <button onClick={handleExport}>Export Decks</button>
      </div>
    </div>
  );
};
