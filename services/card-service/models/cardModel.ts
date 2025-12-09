// const cardSchema = new mongoose.Schema({
//   id: Number,
//   front: String,
//   back: String,
//   cardID: Number,
//   imageUrl: { type: String, default: '' },
//   audioUrl: { type: String, default: '' }
// });

import mongoose, { Schema, Document } from 'mongoose';
export interface ICard extends Document {
//   id: number;
//   name: string;
//   isTemplate?: boolean;
//   templateId?: number;
//   createdAt?: Date;
//   updatedAt?: Date;

    id: number;
  deckId: number;
  front: string;
  back: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const cardSchema = new Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  deckId: { 
    type: Number, 
    required: true 
  },
  front: { 
    type: String, 
    required: true 
  },
  back: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});
export default mongoose.model<ICard>('Card', cardSchema);