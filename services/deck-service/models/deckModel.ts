import mongoose, { Schema, Document } from 'mongoose';
export interface IDeck extends Document {
  id: number;
  name: string;
  userId: string;
  isTemplate?: boolean;
  templateId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const deckSchema = new Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  templateId: { 
    type: Number, 
    default: null 
  },
  isTemplate: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// for each deck in decks:
//   // 1. Új deck dokumentum létrehozása (kártyák nélkül)
//   newDeck = {
//     id: deck.id,
//     name: deck.name,
//     userId: deck.userId,
//     createdAt: deck.createdAt,
//     updatedAt: deck.updatedAt
//   }
//   saveToDeckCollection(newDeck)

export default mongoose.model<IDeck>('Deck', deckSchema);