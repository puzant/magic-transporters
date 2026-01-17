import mongoose, { model, InferSchemaType } from 'mongoose'

const moverSchema = new mongoose.Schema({
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

export type Mover = InferSchemaType<typeof moverSchema>
export type MoverDocument = mongoose.HydratedDocument<Mover>
export const MoverModel = model<MoverDocument>('Mover', moverSchema)