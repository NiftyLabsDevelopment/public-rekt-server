import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  wallet: string,
  token: string,
  rektFinished: boolean,
  points: number[],
  totalPoints: number,
  dayData: string[],
  twitterBonus: boolean
}

const schema = new mongoose.Schema({
    wallet: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    rektFinished: {
      type: Boolean,
      required: true
    },
    points: {
      type: [Number],
      required: false
    },
    totalPoints: {
      type: Number,
      required: false
    },
    dayData: {
      type: [String],
      required: false
    },
    twitterBonus: {
      type: Boolean,
      required: false
    }
});

export default mongoose.model<IUser>('User', schema, "User");