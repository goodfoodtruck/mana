import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Party from "./party"
import Unit from "./unit"

export default class Game {

    private party: Party
    private io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    private allies: Array<Unit>
    private enemies: Array<Unit>
    private order: Array<Unit> = []
    private player: Unit

    constructor(party: Party) {
        this.party = party
        this.io = party.io

        this.allies = party.sockets.map(socket => new Unit(socket.id, socket))
        this.enemies = [new Unit("IA1"), new Unit("IA2"), new Unit("IA3"), new Unit("IA4")]

        this.order = this.order.concat(this.allies, this.enemies)
        this.player = this.order[0]
    }

    public Start() {
        this.Update()
        this.Round()
    }

    private End() {
        this.io.emit("game-state", false)
        this.party.endGame()
    }

    private Round() {
        this.io.emit("turn-state", false)
        this.io.emit("message", `It's ${this.player.id}'s turn`)


        // Check if player is a user
        if (this.player.socket) {
            this.player.socket.emit("turn-state", true)

            this.player.socket.once("press", (targetID: string) => {

                let targetUnit: Unit
                this.order.forEach(unit => {
                    if (targetID === unit.id) targetUnit = unit
                })

                const damage = this.player.attacks(targetUnit!)
                if (targetUnit!.health > 0) {
                    this.io.emit("message", `${this.player.id} deals ${damage} to ${targetID}`)
                } else {
                    this.enemies = this.enemies.filter(enemy => targetUnit !== enemy)
                    this.order = this.order.filter(player => targetUnit !== player)

                    this.io.emit("message", `${targetID} is dead`)

                    this.Update()

                    if (this.enemies.length === 0) {
                        this.End()
                    }
                }
                this.Turn()
            })
        } else {
            this.player.attacks(this.order[0])
            this.Update()
            this.io.emit("message", `${this.player.id} attacked ${this.order[0].id}`)
            this.Turn()
        }
    }

    private Turn() {
        const playerPlace = this.order.indexOf(this.player)
        
        if (playerPlace === this.order.length - 1) {
            this.player = this.order[0]
        } else {
            this.player = this.order[playerPlace + 1]
        }
        
        setTimeout(() => this.Round(), 500)
    }

    private Update() {
        this.io.emit("game-info", {
            allies: this.allies.map(ally => ally.info),
            enemies: this.enemies.map(enemy => enemy.info)
        })
    }
}