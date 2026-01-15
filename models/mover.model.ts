import mongoose, { Document, Model } from 'mongoose'

export interface IMover extends Document {
  name: string
  weightLimit: number
  questsCompleted: number
  state: 'resting' | 'loading' | 'on-mission'
  currentLoad: mongoose.Types.ObjectId[]
}

const moverSchema = new mongoose.Schema<IMover>({
  name: { type: String, required: true },
  weightLimit: { type: Number, required: true },
  questsCompleted: { type: Number, default: 0 },
  state: {
    type: String,
    enum: ['resting', 'loading', 'on-mission'],
    default: 'resting'
  },
  currentLoad: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
})

export const Mover: Model<IMover> = mongoose.model<IMover>('Mover', moverSchema);