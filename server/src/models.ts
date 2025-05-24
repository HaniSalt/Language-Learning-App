import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  id: number;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
}

const cardSchema = new Schema<ICard>({
  id: { type: Number, required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
}, { _id: false });

export interface IDeck extends Document {
  id: number;
  name: string;
  cards: ICard[];
  userId: string; 
}

const deckSchema = new Schema<IDeck>({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  cards: [cardSchema],
  userId: { type: String, required: true, index: true },
});

export const DeckModel = mongoose.model<IDeck>('Deck', deckSchema);

export interface IUser extends Document {
  userName: string;
  userId: string;
  dateOfCreation: string;
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true },
  userId: { type: String, required: true, unique: true, index: true },
  dateOfCreation: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);