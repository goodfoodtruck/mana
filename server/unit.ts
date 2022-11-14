import { Socket } from "socket.io"

export default class Unit {
    public _health: number
    public _id: string
    public socket?: Socket
    public _actions: Array<String> = ["Attack"]

    constructor(id: string, socket?: Socket) {
        this._health = 100
        this._id = id
        this.socket = socket
    }

    public action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
        }
    }
    
    attack(target: Unit) {
        // const damage = Math.floor(Math.random() * 5)
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
    
    receiveDamage(damage: number) {
        this._health -= damage
        if (this._health < 0) this._health = 0 
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

    get info() {
        return {
            health: this._health,
            id: this.id
        }
    }
}