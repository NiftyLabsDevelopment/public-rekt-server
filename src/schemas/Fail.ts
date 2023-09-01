import mongoose, { Document } from 'mongoose';

export interface IError extends Document {
  wallet: string,
  error: string,
}

const schema = new mongoose.Schema({
    wallet: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: true
    }
});

export default mongoose.model<IError>('Failures', schema, "Failures");