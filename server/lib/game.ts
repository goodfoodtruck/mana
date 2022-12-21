import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { setTimeout } from "timers/promises"
import Party from "./party"
import { Unit } from "./characters/unit"
import { Action } from "./characters/actions/action"
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
        this.io.emit("actions-info", this.player.actions, async () => {
            await setTimeout(1500)
            return this.Round()
        })
    }

    private async Round() {
        var action: Action
        var targets: Array<Unit> = []

        await this.Update()
        this.io.emit("turn-state", false)
        this.io.emit("message", `It's ${this.player.name}'s turn`)

        if (this.player.socket) {
            this.player.socket.emit("turn-state", true)
            this.player.socket.once("turn-action", (receivedAction: Action) => {
                this.player.actions.map(actionElem => {
                    if (receivedAction.name === actionElem.name) action = actionElem
                })
                this.player.socket!.emit("turn-target", action.targets)
                this.player.socket!.once("turn-target-selected", async (receivedTargetsID: Array<String>) => {
                    this.order.map(unit => {
                        if (receivedTargetsID.includes(unit.id)) targets.push(unit)
                    })
                    return this.Action(action, targets)
                })
            })
        } else {
            return this.Action(this.player.actions[0], [this.allies[Math.floor(Math.random() * this.allies.length)]])
        }
    }

    private async Action(chosenAction: Action, targets: Array<Unit>) {
        this.io.emit("message", `${this.player.name} uses ${chosenAction.name} !`)
        await setTimeout(500)

        await this.player.doAction(this.io, chosenAction, targets)
        await this.Update()

        this.player.statusActions.map(statusAction => {
            if (statusAction.duration) {
                statusAction.duration -= 1
                if (statusAction.duration <= 0) this.player.removeStatusAction(statusAction)
            }
        })
        this.player.statusEffects.map(statusEffect => {
            if (statusEffect.duration) {
                statusEffect.duration -= 1
                if (statusEffect.duration <= 0) this.player.removeStatusEffect(statusEffect)
            }
        })
        await setTimeout(1000)

        return this.Turn()
    }

    private Turn() {
        const playerPlace = this.order.indexOf(this.player)
        playerPlace === (this.order.length - 1) ? this.player = this.order[0] : this.player = this.order[playerPlace + 1]
        this.Round()
    }

    private async Update() {
        this.order.map(async unit => {
            if (unit.health <= 0) {
                this.io.emit("message", `${unit.name} is dead`)
                this.order = this.order.filter(unitElem => unitElem !== unit)
    
                this.allies.map(ally => {
                    if (ally.id === unit.id) this.allies = this.allies.filter(ally => unit !== ally)
                })
    
                this.enemies.map(enemy => {
                    if (enemy.id === unit.id) this.enemies = this.enemies.filter(enemy => unit !== enemy)
                })
    
                if (this.enemies.length === 0) {
                    await this.Update()
                    await setTimeout(1000)
                    return this.party.endGame(true)
                }
                
                if (this.allies.length === 0) {
                    await this.Update()
                    await setTimeout(1000)
                    return this.party.endGame(false)
                }
            }
        })

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