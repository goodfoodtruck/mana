import { Namespace, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { setTimeout } from "timers/promises"
import { Action } from "./actions/action"
import { HitAction } from "./actions/Hit.action"
import { Status } from "./status/status"
import { PoisonedStatus } from "./status/Poisoned.status"

interface Sprite {
    id: string,
    category: "Small" | "Medium" | "Large"
}

export interface Bonuses {
    attack : number
    armor: number
}

export class Unit {
    private _id: string
    private _name: string
    private _health: number
    private _maxHealth: number
    private _actions: Array<Action>
    private _statusActions: Array<Status<"Action">>
    private _statusEffects: Array<Status<"Effect">>
    private _bonuses: Bonuses
    private _sprite: Sprite
    private _position = {x: 0, y: 0, z: 0}
    public socket?: Socket

    constructor(name: string, sprite: Sprite, socket?: Socket) {
        this._id = name + "#" + Math.floor(Math.random() * 1000)
        this._name = name
        this._health = this._maxHealth = 100
        this._actions = [HitAction]
        this._statusActions = [{...PoisonedStatus}]
        this._statusEffects = []
        this._bonuses = {
            attack:  0,
            armor: 0
        }
        this._sprite = sprite
        this._position = {x: 0, y: 0, z: 0}
        this.socket = socket
    }

    public async doAction(io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, chosenAction: Action, targets: Array<Unit>) {
        this._actions.map(action => {
            if (chosenAction === action && action.factor) {
                action.method(io, action.factor, targets, this._bonuses)
            }
        })
        this._statusActions.map(async statusAction => {
            await setTimeout(800)
            statusAction.method(io, statusAction.factor, [this])
        })
    }
    
    public receiveDamage(damage: number) {
        this._health -= (damage - this._bonuses.armor)
        if (this._health < 0) this._health = 0
    }

    public receiveHealing(healing: number) {
        this._health += healing
        if (this._health >= this._maxHealth) this._health = this._maxHealth
    }

    public receiveStatusAction(status: Status<"Action">) {
        this._statusActions.push(status)
    }

    public removeStatusAction(status: Status<"Action">) {
        this._statusActions = this._statusActions.filter(statusAction => status !== statusAction)
    }

    public receiveStatusEffect(status: Status<"Effect">) {
        this._statusEffects.push(status)
        status.method(this, status.factor)
    }

    public removeStatusEffect(status: Status<"Effect">) {
        this._statusEffects = this._statusEffects.filter(statusEffect => status !== statusEffect)
    }
    
    get info() {
        return {
            name: this._name,
            id: this._id,
            health: this._health,
            sprite: this._sprite,
            position: this._position
        }
    }
    
    get id() {
        return this._id
    }
    
    get name() {
        return this._name
    }
    
    get health() {
        return this._health
    }

    set health(health: number) {
        this._health = health
    }
    
    get actions() {
        return this._actions
    }
    
    get statusActions() {
        return this._statusActions
    }

    get statusEffects() {
        return this._statusEffects
    }
    
    get bonuses() {
        return this._bonuses
    }
    
    set attackBonus(attackBonus: number) {
        this._bonuses.attack = attackBonus
    }

    set armorBonus(armorBonus: number) {
        this._bonuses.attack = armorBonus
    }
    
    get sprite() {
        return this._sprite
    }
    
    get position() {
        return this._position
    }
    
    set position(position: {x: number, y: number, z: number}) {
        this._position = {
            x: position.x,
            y: position.y,
            z: position.z
        }
    }
}