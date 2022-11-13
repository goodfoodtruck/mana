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

        this.allies = party.participants
        this.enemies = [new Unit("IA1")]

        this.order = this.order.concat(this.allies, this.enemies)
        this.player = this.order[0]
    }

    public Start() {
        this.Update()
        return this.Round()
    }

    private Round() {
        this.io.emit("turn-state", false)
        this.io.emit("message", `It's ${this.player.id}'s turn`)

        if (this.player.socket) {
            this.player.socket.emit("turn-state", true)
            this.player.socket.once("press", (data: {choice: string, target: string}) => {
                this.order.forEach(unit => {
                    if (data.target === unit.id) return this.Action(data.choice, unit)
                })
            })
        } else {
            return this.Action("Attack", this.allies[Math.floor(Math.random() * this.allies.length)])
        }
    }
    
    private Action(choice: string, target: Unit) {
        const damage = this.player.action(choice, target)
        if (target.health > 0) {
            this.io.emit("message", `${this.player.id} deals ${damage} to ${target.id}`)
        } else {
            this.io.emit("message", `${target.id} is dead`)
            this.order = this.order.filter(player => target !== player)

            this.allies.map(ally => {
                if (ally.id === target.id) this.allies = this.allies.filter(ally => target !== ally)
            })

            this.enemies.map(enemy => {
                if (enemy.id === target.id) this.enemies = this.enemies.filter(enemy => target !== enemy)
            })

            if (this.enemies.length === 0) {
                return this.party.endGame(true)
            }
            
            if (this.allies.length === 0) {
                return this.party.endGame(false)
            }
        }
        this.Update()
        return this.Turn()
    }

    private Turn() {
        const playerPlace = this.order.indexOf(this.player)
        playerPlace === (this.order.length - 1) ? this.player = this.order[0] : this.player = this.order[playerPlace + 1]
        
        setTimeout(() => this.Round(), 500)
    }

    private Update() {
        this.io.emit("actions-info", this.player.actions)
        this.io.emit("game-info", {
            allies: this.allies.map(ally => ally.info),
            enemies: this.enemies.map(enemy => enemy.info)
        })
    }
}