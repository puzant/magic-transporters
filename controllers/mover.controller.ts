import { Types } from "mongoose"
import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { StatusCodes } from "http-status-codes"

import MoverService from "../services/mover.service"
import AppError from "../utils/appError"
import ApiResponse from "../utils/apiResponse"

export default class MoverController {
  constructor(private moverService: MoverService) {}

  addMover = asyncHandler(async (req: Request, res: Response) => {
    const { name, weightLimit } = req.body 

    if (typeof name !== "string" || name.trim() === "") 
      throw new AppError("Name is required", StatusCodes.BAD_REQUEST)

    if (typeof weightLimit !== "number" || weightLimit <= 0) 
      throw new AppError("Weight limit must be a postive number", StatusCodes.BAD_REQUEST)

    const mover = await this.moverService.addMover({ name, weightLimit })
    res.status(StatusCodes.CREATED).json(ApiResponse.successResponse('Mover added', mover))
  })

  addItem = asyncHandler(async (req: Request, res: Response) => {
    const { name, weight } = req.body 

    if (typeof name !== "string" || name.trim() === "") 
      throw new AppError("Name is required", StatusCodes.BAD_REQUEST)

    if (typeof weight !== "number" || weight <= 0) 
      throw new AppError("Weight must be a postive number", StatusCodes.BAD_REQUEST)


    const item = await this.moverService.addItem({ name, weight })
    res.status(StatusCodes.CREATED).json(ApiResponse.successResponse('Item added', item))
  })

  loadMover = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { itemIds } = req.body

    if (!Types.ObjectId.isValid(id)) 
      throw new AppError("Invalid mover id", StatusCodes.BAD_REQUEST)
    
    if (!Array.isArray(itemIds)) 
      throw new AppError("Item IDs must be an array", StatusCodes.BAD_REQUEST)

    const moverId = new Types.ObjectId(id)

    const itemObjectIds = (itemIds as string[]).map((id) => {
      if (!Types.ObjectId.isValid(id)) 
        throw new AppError("Invalid item id", StatusCodes.BAD_REQUEST)

      return new Types.ObjectId(id)
    })
    
    const mover = await this.moverService.loadMover(moverId, itemObjectIds)
    res.json(ApiResponse.successResponse("Mover loaded", mover))
  })

  startMission = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) 
      throw new AppError("Invalid mover id", StatusCodes.BAD_REQUEST)

    const moverId = new Types.ObjectId(id)

    const mover = await this.moverService.startMission(moverId)
    res.json(ApiResponse.successResponse("Mission started", mover))
  })

  endMission = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) 
      throw new AppError("Invalid mover id", StatusCodes.BAD_REQUEST)

    const moverId = new Types.ObjectId(id)

    const mover = await this.moverService.endMission(moverId)
    res.json(ApiResponse.successResponse("Mission ended", mover))
  })

  getTopMovers = asyncHandler(async (req: Request, res: Response) => {
    const topMovers = await this.moverService.getTopMovers()
    res.json(ApiResponse.successResponse("Top movers retrieved", topMovers)) 
  })

}