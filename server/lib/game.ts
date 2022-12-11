import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Party from "./party"
import Unit from "./characters/unit"
import Bestiary from "./characters/bestiary"

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

        this.allies = this.Placement(party.participants)
        this.enemies = this.Placement([
            new Bestiary[Math.floor(Math.random() * Bestiary.length)],
            new Bestiary[Math.floor(Math.random() * Bestiary.length)],
            new Bestiary[Math.floor(Math.random() * Bestiary.length)],
            new Bestiary[Math.floor(Math.random() * Bestiary.length)]
        ])

        this.order = this.order.concat(this.allies, this.enemies)
        this.player = this.order[0]
    }

    public async Start() {
        await this.Update()
        this.io.emit("actions-info", this.player.actions, () => {
            return this.Round()
        })
    }

    private async Round() {
        await this.Update()
        this.io.emit("turn-state", false)
        this.io.emit("message", `It's ${this.player.name}'s turn`)

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
    
    private async Action(choice: string, target: Unit) {
        const damage = this.player.action(choice, target)
        if (target.health > 0) {
            this.io.emit("anim-damage", {id: target.id, damage: damage})
            this.io.emit("message", `${this.player.name} deals ${damage} to ${target.name}`)
        } else {
            this.io.emit("message", `${target.name} is dead`)
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
        await this.Update()
        return this.Turn()
    }

    private Turn() {
        const playerPlace = this.order.indexOf(this.player)
        playerPlace === (this.order.length - 1) ? this.player = this.order[0] : this.player = this.order[playerPlace + 1]
        
        setTimeout(() => this.Round(), 600)
    }

    private async Update() {
        this.io.emit("game-info", {
            allies: this.allies.map(ally => ally.info),
            enemies: this.enemies.map(enemy => enemy.info)
        }, () => {
            return
        })
    }

    private Placement = (characters: Array<Unit>) => {
        const grid: Array<Unit | undefined> = [
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined
        ]
    
        for (const character of characters) {
            var place: number
            while(true) {
                place = Math.floor(Math.random() * (15 - 1) + 0)
                if (character.sprite.category === "Small") {
                    if (grid[place] === undefined) {
                        grid[place] = character
                        character.position = {
                            x: place % 4 + 1,
                            y: Math.floor(place / 4) + 1,
                            z: place < 4 ? 0 : place < 8 ? 1 : place < 12 ? 2 : place < 16 ? 3 : 0
                        }
                        break
                    }
                }
                if (character.sprite.category === "Medium") {
                    if (grid[place] === undefined && grid[place + 1] === undefined && grid[place - 1] === undefined && grid[place - 4] === undefined) {
                        grid[place] = character
                        character.position = {
                            x: place % 4 + 1,
                            y: Math.floor(place / 4) + 1,
                            z: place < 4 ? 0 : place < 8 ? 1 : place < 12 ? 2 : place < 16 ? 3 : 0
                        }
                        break
                    }
                }
                if (character.sprite.category === "Large") {
                    if (grid[place] === undefined && grid[place + 1] === undefined && grid[place - 1] === undefined && grid[place - 5] === undefined && grid[place - 4] === undefined && grid[place + 5] === undefined) {
                        grid[place] = character
                        character.position = {
                            x: place % 4 + 1,
                            y: Math.floor(place / 4) + 1,
                            z: place < 4 ? 0 : place < 8 ? 1 : place < 12 ? 2 : place < 16 ? 3 : 0
                        }
                        break
                    }
                }
            }
        }
        return characters
    }
}