import { httpServer } from "./server"
import { Server } from "socket.io"
import { manageParty } from "./party"

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