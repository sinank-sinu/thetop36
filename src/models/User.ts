import mongoose, { Schema, models, model } from 'mongoose';

export interface IUser {
  email: string;
  tickets: number;
  referrals: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    tickets: { type: Number, required: true, default: 0 },
    referrals: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);
