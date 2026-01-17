import mongoose, { model, InferSchemaType } from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true }
})

export type Item = InferSchemaType<typeof itemSchema>
export type ItemDocument = mongoose.HydratedDocument<Item>
export const ItemModel = model<ItemDocument>('Item', itemSchema)