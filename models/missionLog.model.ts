import mongoose, { Document, Model } from "mongoose"

export interface IMissionLog extends Document {
  mover: mongoose.Types.ObjectId
  action: 'loading' | 'start-mission' | 'end-mission'
  items: mongoose.Types.ObjectId[]
  timestamp: Date
}

const missionLogSchema = new mongoose.Schema<IMissionLog>({
  mover: { type: mongoose.Schema.Types.ObjectId, ref: 'Mover', required: true },
  action: { type: String, enum: ['loading', 'start-mission', 'end-mission'], required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  timestamp: { type: Date, default: Date.now }
})

export const MissionLog: Model<IMissionLog> = mongoose.model<IMissionLog>('MissionLog', missionLogSchema);