import { FunctionalComponent } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { TextField, Button } from '@mui/material';
import { Deck, Card, updateDeckApi } from "../../utils/deckApi";
import './cardEditorStyles.less';

export interface CardEditorProps {
  deckId: number;
  userId: string;
  onCardAdded: (updatedDeck: Deck) => void;
  onCancel: () => void;
}

export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId, userId, onCardAdded, onCancel }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!frontText.trim() || !backText.trim()) {
      alert('Front and back text cannot be empty.');
      return;
    }

    let imageUrl = '';
    let audioUrl = '';

    try {
      if (imageInputRef.current && imageInputRef.current.files?.length) {
        const imageFile = imageInputRef.current.files[0];
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (imageFile.size > maxSizeInBytes) {
          alert('Image size exceeds 2MB limit.');
          return;
        }
        imageUrl = await resizeImage(imageFile, 800, 600);
      }

      if (audioInputRef.current && audioInputRef.current.files?.length) {
        audioUrl = await readFileAsDataURL(audioInputRef.current.files[0]);
      }

      // Create the new card
      const newCard: Omit<Card, 'id'> = { // API/backend handles new card ID generation
        front: frontText,
        back: backText,
        imageUrl,
        audioUrl,
      };
      const tempNewCardWithId: Card = {
        ...newCard,
        id: Date.now(), // Temporary ID, backend should generate its own persistent ID
      };
      const updatedDeck = await updateDeckApi(deckId, { cards: [tempNewCardWithId] as any, userId });


      onCardAdded(updatedDeck);
      setFrontText('');
      setBackText('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (audioInputRef.current) audioInputRef.current.value = '';

    } catch (error) {
      console.error('Failed to add card:', error);
      alert(`Error adding card: ${error.message || 'Please try again.'}`);
    }
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
        required
      />
      <TextField
        label="Back"
        value={backText}
        onChange={(e: any) => setBackText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
        required
      />
      <div class="file-inputs">
        <label>
          Image:
          <input type="file" accept="image/*" ref={imageInputRef} />
        </label>
        <label>
          Audio:
          <input type="file" accept="audio/*" ref={audioInputRef} />
        </label>
      </div>
      <div class="card-editor-actions">
        <Button type="submit" variant="contained" color="primary">
          Save Card
        </Button>
        <Button variant="outlined" onClick={() => {
            setFrontText(''); setBackText('');
            if (imageInputRef.current) imageInputRef.current.value = '';
            if (audioInputRef.current) audioInputRef.current.value = '';
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};