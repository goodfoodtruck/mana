import { Namespace, Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Game from "./game"

let parties: Array<Party> = []

export const manageParty = (io: Server, socket: Socket) => {
    const partyID = Math.floor(1000 + Math.random() * 9000)

    socket.emit("party-create", partyID)
    parties.push(new Party(io, partyID))

    socket.on("disconnect", () => {
        parties = parties.filter(party => party.id !== partyID)
    })
}

export default class Party {

    private game?: Game | null
    public io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    public sockets: Array<Socket>
    public id: number
    public isOpen: boolean

    constructor(io: Server, partyID: number) {
        this.io = io.of("/" + partyID)
        this.sockets = []
        this.id = partyID
        this.isOpen = true

        this.io.on("connect", socket => {
            this.socketEvents(socket)
        })
    }

    private socketEvents(socket: Socket) {
        this.add(socket)

        this.io.emit("party-info", this.sockets.map(socket => socket.id))

        socket.on("start", () => {
            this.isOpen = false
            this.startGame()
        })

        socket.on("party-change", (partyID, callback) => {
            this.change(partyID, callback)
        })
        
        socket.on("disconnect", () => {
            this.remove(socket)                
            this.io.emit("party-info", this.sockets.map(socket => socket.id))
        })
    }

    private add(socket: Socket) {
        this.sockets.push(socket)
        if (this.sockets.length == 3) this.isOpen = false
    }

    private remove(socket: Socket) {
        this.sockets = this.sockets.filter(filterSocket => socket.id !== filterSocket.id)
        if (this.sockets.length < 3) this.isOpen = true
    }

    private change(id: number, callback: (isOpen: boolean) => void) {
        parties.map(party => {
            party.id == id ? callback(party.isOpen) : null
        })
    }

    private startGame() {
        this.game = new Game(this)
        this.io.emit("game-state", true)
        return this.game.Start()
    }

    public endGame() {
        this.game = null
        if (this.sockets.length < 3) this.isOpen = true
    }
}