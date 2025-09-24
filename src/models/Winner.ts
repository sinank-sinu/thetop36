import { Schema, models, model } from 'mongoose';

export interface IWinner {
  email: string;
  prize: string;
  drawDate: Date;
  createdAt: Date;
}

const WinnerSchema = new Schema<IWinner>({
  email: { type: String, required: true },
  prize: { type: String, required: true },
  drawDate: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Winner = models.Winner || model<IWinner>('Winner', WinnerSchema);
