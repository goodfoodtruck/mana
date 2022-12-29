import { Namespace, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { setTimeout } from "timers/promises"
import { Status, StatusAttackOrHeal, StatusBonusOrMalus } from "../status/status"
import { Skill } from "../skills/skill"
import { HitSkill } from "../skills/Hit.skill"

interface Sprite {
    id: string,
    category: "Small" | "Medium" | "Large"
}

export class Unit {
    private _id: string
    private _name: string
    private _maxHealth: number = 100
    private _health: number = this._maxHealth
    private _skills: Array<Skill> = [HitSkill]
    private _statuses: Array<Status> = []
    private _attackBonus: number = 0
    private _armorBonus: number = 0
    private _sprite: Sprite
    private _position: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0}
    public socket?: Socket

    constructor(name: string, sprite: Sprite, socket?: Socket) {
        this._id = name + "#" + Math.floor(Math.random() * 1000)
        this._name = name
        this._sprite = sprite
        this.socket = socket
    }

    public async useSkill(io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, skill: Skill, targets: Array<Unit>) {
        io.emit("message", `${this.name} uses ${skill.name} !`)
        await setTimeout(1000)
        skill.useSkill(io, targets, this, skill.status)
        await setTimeout(500)
        this._statuses.map(statusElem => {
            if (statusElem instanceof StatusAttackOrHeal) {
                statusElem.action(this)
                io.emit(statusElem.event, {target: this.id, damageOrHealing: statusElem.factor})
            }
        })
    }
    
    public receiveDamage(damage: number) {
        this._health -= (damage - this._armorBonus)
        if (this._health < 0) this._health = 0
    }

    public receiveHealing(healing: number) {
        this._health += healing
        if (this._health >= this._maxHealth) this._health = this._maxHealth
    }

    public receiveStatus(status: Status) {
        this._statuses.push(status)
        if (status instanceof StatusBonusOrMalus) status.affect(this)
    }

    public removeStatus(status: Status) {
        if (status instanceof StatusBonusOrMalus) status.relieve(this)
        this._statuses = this._statuses.filter(statusElem => status !== statusElem)
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
    
    get skills() {
        return this._skills
    }
    
    get statuses() {
        return this._statuses
    }
    
    set attackBonus(attackBonus: number) {
        this._attackBonus = attackBonus
    }

    set armorBonus(armorBonus: number) {
        this._armorBonus = armorBonus
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