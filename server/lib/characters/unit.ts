import { Socket } from "socket.io"

interface Sprite {
    id: string,
    category: "Small" | "Medium" | "Large"
}

export default class Unit {
    private _name: string
    private _health: number
    private _id: string
    public socket?: Socket
    protected _actions: Array<String> = ["Attack"]
    private _sprite: Sprite
    private _position = {x: 0, y: 0, z: 0}

    constructor(name: string, sprite: Sprite, socket?: Socket) {
        this._name = name
        this._id = name + "#" + Math.floor(Math.random() * 1000)
        this._health = 100
        this.socket = socket
        this._sprite = sprite
    }

    public action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
        }
    }
    
    attack(target: Unit) {
        // const damage = Math.floor(Math.random() * 5)
        const damage = 1
        target.receiveDamage(damage)
        return damage
    }
    
    receiveDamage(damage: number) {
        this._health -= damage
        if (this._health < 0) this._health = 0
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

    get info() {
        return {
            name: this._name,
            id: this._id,
            health: this._health,
            sprite: this._sprite,
            position: this._position
        }
    }
}