import { FunctionalComponent } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { TextField, Button } from '@mui/material';
import { createCard } from "../../utils/cardApi";
import './cardEditorStyles.less';

export interface CardEditorProps {
  deckId: number;
  userId: string;
  onCardAdded: () => void;
  onCancel: () => void;
}

export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId, userId, onCardAdded, onCancel }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    let imageUrl = '';
    let audioUrl = '';

    try {
      if (imageInputRef.current && imageInputRef.current.files?.length) {
        const imageFile = imageInputRef.current.files[0];
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (imageFile.size > maxSizeInBytes) {
          alert('Image size exceeds 2MB limit.');
          setIsSubmitting(false);
          return;
        }
        imageUrl = await resizeImage(imageFile, 800, 600);
      }

      if (audioInputRef.current && audioInputRef.current.files?.length) {
        audioUrl = await readFileAsDataURL(audioInputRef.current.files[0]);
      }

      console.log('Creating card with deckId:', deckId);
      
      // Use the new cardApi to create the card
      await createCard(deckId, frontText.trim(), backText.trim(), imageUrl, audioUrl);

      // Clear form
      setFrontText('');
      setBackText('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (audioInputRef.current) audioInputRef.current.value = '';

      // Trigger parent to refresh - just call without arguments
      onCardAdded();
      
    } catch (error) {
      console.error('Failed to add card:', error);
      alert(`Error adding card: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
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
        disabled={isSubmitting}
      />
      <TextField
        label="Back"
        value={backText}
        onChange={(e: any) => setBackText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
        required
        disabled={isSubmitting}
      />
      <div class="file-inputs">
        <label>
          Image:
          <input type="file" accept="image/*" ref={imageInputRef} disabled={isSubmitting} />
        </label>
        <label>
          Audio:
          <input type="file" accept="audio/*" ref={audioInputRef} disabled={isSubmitting} />
        </label>
      </div>
      <div class="card-editor-actions">
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Card'}
        </Button>
        <Button 
          variant="outlined" 
          disabled={isSubmitting}
          onClick={() => {
            setFrontText(''); 
            setBackText('');
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