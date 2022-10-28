import express from 'express'
import { createServer } from 'http'
import cors from 'cors'

const app = express()
app.use(cors())

export const httpServer = createServer(app)