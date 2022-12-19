import { Namespace, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Action } from "./actions/action"
import { Status } from "./status/status"
import { HitAction } from "./actions/Hit.action"
import { PoisonStatus } from "./status/Poison.status"

interface Sprite {
    id: string,
    category: "Small" | "Medium" | "Large"
}

export default class Unit {
    private _name: string
    private _health: number
    private _maxHealth: number
    private _id: string
    public socket?: Socket
    protected _actions: Array<Action>
    private _status: Array<Status>
    private _sprite: Sprite
    private _position = {x: 0, y: 0, z: 0}

    constructor(name: string, sprite: Sprite, socket?: Socket) {
        this._name = name
        this._id = name + "#" + Math.floor(Math.random() * 1000)
        this._maxHealth = 100
        this._health = this._maxHealth
        this.socket = socket
        this._sprite = sprite
        this._actions = [HitAction]
        this._status = [PoisonStatus]
    }

    public async doAction(io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, chosenAction: Action, targets: Array<Unit>) {
        this._actions.map(action => {
            if (chosenAction === action && action.factor) {
                action.method(io, action.factor, targets)
            }
        })
    }
    
    public receiveDamage(damage: number) {
        this._health -= damage
        if (this._health < 0) this._health = 0
    }

    public receiveHealing(healing: number) {
        this._health += healing
        if (this._health >= this._maxHealth) this._health = this._maxHealth
    }

    public receiveStatus(status: Status) {
        this._status.push(status)
    }

    public removeStatus(status: Status) {
        if (this._status.includes(status)) this._status = this._status.filter(statusElem => statusElem !== status)
    }

    set position(position: {x: number, y: number, z: number}) {
        this._position = {
            x: position.x,
            y: position.y,
            z: position.z
        }
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

    get name() {
        return this._name
    }
    
    get health() {
        return this._health
    }

    set health(health: number) {
        this._health = health
    }
    
    get id() {
        return this._id
    }

    get actions() {
        return this._actions
    }

    get status() {
        return this._status
    }

    get sprite() {
        return this._sprite
    }

    get position() {
        return this._position
    }

}