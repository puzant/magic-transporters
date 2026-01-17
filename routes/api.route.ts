import { Router } from "express"
import { MoverModel } from "../models/mover.model"
import { ItemModel } from "../models/item.model"
import { MissionLogModel } from "../models/missionLog.model"
import MoverService from "../services/mover.service"
import MoverController from "../controllers/mover.controller"

const router = Router()
const moverService = new MoverService(MoverModel, ItemModel, MissionLogModel)
const moverController = new MoverController(moverService)

router.post('/movers', moverController.addMover)
router.post('/items', moverController.addItem)
router.post('/movers/:id/load', moverController.loadMover)
router.post('/movers/:id/start-mission', moverController.startMission)
router.post('/movers/:id/end-mission', moverController.endMission)
router.get('/top-movers', moverController.getTopMovers)

export default router