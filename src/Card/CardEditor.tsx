import { FunctionalComponent, h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { TextField, Button } from '@mui/material';
import { addCardToDeck, getDeckById, Deck } from '../utils/storage';
import './cardEditorStyles.less';

interface CardEditorProps {
  deckId: number; // ID of the deck to which the card will be added
  onCardAdded: (updatedDeck: Deck) => void; // Callback when a card is added
  onCancel: () => void; // Callback to cancel adding a card
}

// CardEditor component definition
export const CardEditor: FunctionalComponent<CardEditorProps> = ({ deckId, onCardAdded, onCancel }) => {
  // State variables for the front and back text of the card
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  // Refs for the image and audio file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Handles form submission to add a new card
  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    let imageUrl = '';
    let audioUrl = '';

    // Helper function to read a file as a data URL
    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Handle image file input
    if (imageInputRef.current && imageInputRef.current.files?.length) {
      const imageFile = imageInputRef.current.files[0];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB size limit
      if (imageFile.size > maxSizeInBytes) {
        alert('Image size exceeds 2MB limit.');
        return;
      }
      // Resize the image before saving
      imageUrl = await resizeImage(imageFile, 800, 600); // Adjust max dimensions as needed
    }

    // Handle audio file input
    if (audioInputRef.current && audioInputRef.current.files?.length) {
      const audioFile = audioInputRef.current.files[0];
      // Read the audio file as a data URL
      audioUrl = await readFileAsDataURL(audioFile);
    }

    // Add the new card to the deck
    addCardToDeck(deckId, frontText, backText, imageUrl, audioUrl);
    const updatedDeck = getDeckById(deckId);
    if (updatedDeck) {
      onCardAdded(updatedDeck); // Notify parent component of the update
    }
  };

  // Resizes an image file to specified maximum dimensions
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          let { width, height } = img;
          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          // Create a canvas to draw the resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          // Convert the canvas to a data URL
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
      {/* Input for the front text of the card */}
      <TextField
        label="Front"
        value={frontText}
        onChange={(e: any) => setFrontText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      {/* Input for the back text of the card */}
      <TextField
        label="Back"
        value={backText}
        onChange={(e: any) => setBackText(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      {/* File inputs for image and audio */}
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
      {/* Action buttons */}
      <div class="card-editor-actions">
        <Button type="submit" variant="contained" color="primary">
          Save Card
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            // Reset the form fields and cancel
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
