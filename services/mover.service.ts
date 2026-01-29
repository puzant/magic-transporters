import { Model, Types } from "mongoose"
import { Mover } from "../models/mover.model"
import { Item } from "../models/item.model"
import { MissionLog } from "../models/missionLog.model"

import AppError from "../utils/appError"
import { StatusCodes as Status } from "http-status-codes"

enum STATE {
  RESTING = 'resting',
  LOADING = 'loading',
  ['ON-MISSION'] = 'on-mission'
}

class MoverService {
  constructor(
    private Mover: Model<Mover>, 
    private Item: Model<Item>,
    private MissionLog:Model<MissionLog>
  ) {}
  
  async addMover(data: { name: string, weightLimit: number }): Promise<Mover> {
    return this.Mover.create(data)
  }

  async addItem(data: { name: string, weight: number }): Promise<Item> {
    return this.Item.create(data)
  }

  /**
  * Loads items onto a mover and transitions it to the "loading" state.
  * 
  * Business rules:
  * - Mover must exist
  * - Mover must be in the "resting" state
  * - Total item weight must not exceed the mover's weight limit
  *
  * Side effects:
  * - Updates mover state and current load
  * - Creates a mission log entry with action "loading"
  *
  * @param {Types.ObjectId} moverId - Mover identifier
  * @param {Types.ObjectId[]} itemIds - Item identifiers to load
  * @returns {Promise<Mover>} Updated mover document
  *
  * @throws {AppError} If mover does not exist
  * @throws {AppError} If mover is not resting
  * @throws {AppError} If total item weight exceeds mover limit
  */
  async loadMover(moverId: Types.ObjectId, itemIds: Types.ObjectId[]): Promise<Mover> {
    const mover = await this.Mover.findById(moverId)

    if (!mover) 
      throw new AppError("Mover not found", Status.NOT_FOUND)

    if (mover.state !== STATE.RESTING) 
      throw new AppError("Mover must be resting to load items", Status.BAD_REQUEST)

    const items = await this.Item.find({ _id: { $in: itemIds } })
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)

    if (totalWeight > mover.weightLimit) 
      throw new AppError("Total weight exceeds mover limit", Status.BAD_REQUEST)

    mover.currentLoad = itemIds
    mover.state = 'loading'
    await mover.save()

    await this.MissionLog.create({
      mover: moverId,
      action: 'loading',
      items: itemIds,
    })

    return mover
  }

  /**
   * Starts a mission for a mover.
   *
   * Business rules:
   * - Mover must exist
   * - Mover must be in the "loading" state
   *
   * Side effects:
   * - Transitions mover state to "on-mission"
   * - Increments questsCompleted counter
   *
   * @param {Types.ObjectId} moverId - Mover identifier
   * @returns {Promise<Mover>} Updated mover document
   *
   * @throws {AppError} If mover does not exist
   * @throws {AppError} If mover is not in loading state
   */
  async startMission(moverId: Types.ObjectId): Promise<Mover> {
    const mover = await this.Mover.findById(moverId)

    if (!mover) 
      throw new AppError("Mover not found", Status.NOT_FOUND)

    if (mover.state !== STATE.LOADING) 
      throw new AppError("Mover must be loaded to start a mission", Status.BAD_REQUEST)

    mover.state = 'on-mission'
    mover.questsCompleted += 1
    
    await mover.save()
    await this.MissionLog.create({ mover: moverId, action: 'start-mission' })

    return mover
  }

  /**
   * Ends an active mission for a mover.
   *
   * Business rules:
   * - Mover must exist
   * - Mover must be in the "on-mission" state
   *
   * Side effects:
   * - Clears mover's current load
   * - Transitions mover state to "resting"
   * - Creates a mission log entry with action "end-mission"
   *
   * @param {Types.ObjectId} moverId - Mover identifier
   * @returns {Promise<Mover>} Updated mover document
   *
   * @throws {AppError} If mover does not exist
   * @throws {AppError} If mover is not currently on a mission
   */
  async endMission(moverId: Types.ObjectId): Promise<Mover> {
    const mover = await this.Mover.findById(moverId)

    if (!mover) 
      throw new AppError("Mover not found", Status.NOT_FOUND)

    if (mover.state !== STATE["ON-MISSION"]) 
      throw new AppError("Mover must be on mission to end it", Status.BAD_REQUEST)

    const items = mover.currentLoad
    mover.currentLoad = []
    mover.state = 'resting'
    
    await mover.save()
    await this.MissionLog.create({ mover: moverId, action: 'end-mission', items })
    return mover
  }

  async getTopMovers(): Promise<any[]> {
    return await this.Mover.find()
      .sort({ questsCompletd: -1 })
      .limit(20)
      .select('name questsCompleted')
  }
}

export default MoverService