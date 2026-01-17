import mongoose, { model, InferSchemaType } from "mongoose"

const missionLogSchema = new mongoose.Schema({
  mover: { type: mongoose.Schema.Types.ObjectId, ref: 'Mover', required: true },
  action: { type: String, enum: ['loading', 'start-mission', 'end-mission'], required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  timestamp: { type: Date, default: Date.now }
})

export type MissionLog = InferSchemaType<typeof missionLogSchema>
export type MissionLogDocument = mongoose.HydratedDocument<MissionLog>
export const MissionLogModel = model<MissionLogDocument>('MissionLog', missionLogSchema)