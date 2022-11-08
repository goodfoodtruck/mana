import { Namespace, Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Game from "./game"
import Unit from "./unit"

let parties: Array<Party> = []

export const manageParty = (io: Server, socket: Socket) => {
    const partyID = Math.floor(1000 + Math.random() * 9000)

    socket.emit("party-create", partyID)
    parties.push(new Party(io, partyID))
}

export default class Party {

    private game?: Game | null
    public io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    public id: number
    public participants: Array<Unit> = []
    public isOpen: boolean = true

    constructor(io: Server, partyID: number) {
        this.io = io.of("/" + partyID)
        this.id = partyID

        this.io.on("connect", socket => {
            socket.on("player-info", (name: string) => {
                this.socketEvents(name, socket)
            })
        })
    }

    private socketEvents(name:string, socket: Socket) {
        this.add(name, socket)

        this.io.emit("party-info", this.participants.map(participant => participant.id))

        socket.on("start", () => {
            this.isOpen = false
            this.startGame()
        })

        socket.on("party-change", (partyID, callback) => {
            this.change(partyID, callback)
        })
        
        socket.on("disconnect", () => {
            this.remove(name)                
            this.io.emit("party-info", this.participants.map(participant => participant.id))
        })
    }

    private add(name:string, socket: Socket) {
        this.participants.push(new Unit(name, socket))
        if (this.participants.length == 3) this.isOpen = false
    }

    private remove(name: string) {
        this.participants = this.participants.filter(participant => name !== participant.id)
        if (this.participants.length < 3) this.isOpen = true
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
        if (this.participants.length < 3) this.isOpen = true
    }
}