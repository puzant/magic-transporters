import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db'
import apiRoutes from './routes/api.route'

import errorHandler from "./middleware/error.middleware"

dotenv.config() 

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', apiRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()