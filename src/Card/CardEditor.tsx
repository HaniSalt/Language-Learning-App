import { FunctionalComponent, h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { TextField, Button } from '@mui/material';
import { addCardToDeck, getDeckById, Deck } from '../utils/storage';
import './cardEditorStyles.less';

interface CardEditorProps {
  deckId: number;
  onCardAdded: (updatedDeck: Deck) => void;
}

export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId, onCardAdded }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
  
    let imageUrl = '';
    let audioUrl = '';
  
    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
  
    // Handle image file
    if (imageInputRef.current && imageInputRef.current.files?.length) {
      const imageFile = imageInputRef.current.files[0];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (imageFile.size > maxSizeInBytes) {
        alert('Image size exceeds 2MB limit.');
        return;
      }
      imageUrl = await resizeImage(imageFile, 800, 600); // Adjust max dimensions as needed
    }
  
    // Handle audio file
    if (audioInputRef.current && audioInputRef.current.files?.length) {
      const audioFile = audioInputRef.current.files[0];
      audioUrl = await readFileAsDataURL(audioFile);
    }
  
    // Proceed to save the card
    addCardToDeck(deckId, frontText, backText, imageUrl, audioUrl);
    const updatedDeck = getDeckById(deckId);
    if (updatedDeck) {
      onCardAdded(updatedDeck);
    }
  };
  
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  

  return (
    <form onSubmit={handleSubmit} class="card-editor-form">
      <h3>Add a New Card</h3>
      <TextField
        label="Front"
        value={frontText}
        onChange={(e: any) => setFrontText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Back"
        value={backText}
        onChange={(e: any) => setBackText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <div class="file-inputs">
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
          />
        </label>
        <label>
          Audio:
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
          />
        </label>
      </div>
      <div class="card-editor-actions">
        <Button type="submit" variant="contained" color="primary">
          Save Card
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};