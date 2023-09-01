import mongoose, { Document } from 'mongoose';

export interface IUserQuestion extends Document {
  user: mongoose.Types.ObjectId,
  answer: string[]
}

const schema = new mongoose.Schema({
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    answer: {
      type: [String],
      required: true
    }
    
});

export default mongoose.model<IUserQuestion>('UserQuestion', schema, "UserQuestion");