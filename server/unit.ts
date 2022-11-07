import { Socket } from "socket.io"

export default class Unit {
    private _health: number
    public id: string
    public socket?: Socket

    constructor(id: string, socket?: Socket) {
        this._health = 100
        this.id = id
        this.socket = socket
    }
    
    public attacks(target: Unit) {
        // const damage = Math.floor(Math.random() * 5)
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
    
    private receiveDamage(damage: number) {
        this._health -= damage
        if (this._health < 0) this._health = 0 
    }
    
    get health() {
        return this._health
    }

    get info() {
        return {
            health: this._health,
            id: this.id
        }
    }
}