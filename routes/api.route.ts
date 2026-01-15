import { Router } from "express"
import { Mover } from "../models/mover.model"
import { Item } from "../models/item.model"
import { MissionLog } from "../models/missionLog.model"
import MoverService from "../services/mover.service"
import MoverController from "../controllers/mover.controller"

const router = Router()
const moverService = new MoverService(Mover, Item, MissionLog)
const moverController = new MoverController(moverService)

router.post('/movers', moverController.addMover)
router.post('/items', moverController.addItem)
router.post('/movers/:id/load', moverController.loadMover)
router.post('/movers/:id/start-mission', moverController.startMission)
router.post('/movers/:id/end-mission', moverController.endMission)
router.get('/top-movers', moverController.getTopMovers)

export default router