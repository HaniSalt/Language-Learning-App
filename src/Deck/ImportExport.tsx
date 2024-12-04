import { FunctionalComponent, h } from 'preact';
import { importDecks, exportDecks, Deck } from '../utils/storage';
import { useRef } from 'preact/hooks';
import './importExportStyles.less';

export const ImportExport: FunctionalComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as Deck[];
          importDecks(data);
          alert('Decks imported successfully!');
        } catch (error) {
          alert('Failed to import decks. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const dataStr = exportDecks();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decks.json';
    link.click();
  };

  return (
    <div class="import-export">
      <h2>Import/Export Decks</h2>
      <div class="import-section">
        <input type="file" ref={fileInputRef} accept=".json" />
        <button onClick={handleImport}>Import Decks</button>
      </div>
      <div class="export-section">
        <button onClick={handleExport}>Export Decks</button>
      </div>
    </div>
  );
};
