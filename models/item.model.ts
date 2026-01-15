import mongoose, { Document, Model } from 'mongoose'

export interface IItem extends Document {
  name: string
  weight: number
}

const itemSchema = new mongoose.Schema<IItem>({
  name: { type: String, required: true },
  weight: { type: Number, required: true }
})

export const Item: Model<IItem> = mongoose.model<IItem>('Item', itemSchema)