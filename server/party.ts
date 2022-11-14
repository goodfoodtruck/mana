import { Namespace, Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Game from "./game"
import Unit from "./unit"
import Guardian from "./masteries/Guardian.unit"
import Samurai from "./masteries/Samurai.unit"
import Sage from "./masteries/Sage.unit"
import Druid from "./masteries/Druid.unit"

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
            socket.on("player-info", (data: {name: string, mastery: string}) => {
                this.socketEvents(data.name, data.mastery, socket)
            })
        })
    }

    private socketEvents(name:string, mastery: string, socket: Socket) {
        this.add(name, mastery, socket)
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

    private add(name:string, mastery: string, socket: Socket) {
        switch(mastery) {
            case "Guardian":
                this.participants.push(new Guardian(name, socket))
                break
            case "Samurai":
                this.participants.push(new Samurai(name, socket))
                break
            case "Sage":
                this.participants.push(new Sage(name, socket))
                break
            case "Druid":
                this.participants.push(new Druid(name, socket))
                break
        }
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

    public endGame(repeat: boolean) {
        this.io.emit("game-state", false)
        this.game = null
        if (repeat) {
            this.startGame()
        } else if (this.participants.length < 3) {
            this.participants.map(participant => participant.health = 100)
            this.isOpen = true
        }
    }
}