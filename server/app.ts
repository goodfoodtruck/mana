import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { Server } from "socket.io"
import { manageParty } from "./lib/party"

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on("connect", socket => manageParty(io, socket))

httpServer.listen(4000, () => {
    console.log('Server is running...')
})