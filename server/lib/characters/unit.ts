import { Namespace, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { setTimeout } from "timers/promises"
import { Status, StatusBonusOrMalus } from "../status/status"
import { Skill, SkillStatus } from "../skills/skill"
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
    protected _skills: Array<Skill> = [HitSkill]
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
        switch(skill.type) {
            case "Attack":
                var damage = skill.factor + this.attackBonus
                targets.map(target => {
                    io.emit("anim-attack", {id: target.id, damage: damage})
                    target.receiveDamage(damage)
                })
                break
            case "Healing":
                var healing = skill.factor
                targets.map(target => {
                    io.emit("anim-healing", {id: target.id, healing: healing})
                    target.receiveHealing(healing)
                })
                break
            case "Status":
                break
        }

        if (this.isSkillStatus(skill)) {
            targets.map(target => {
                io.emit("anim-status", {id: target.id, status: skill.status})
                target.receiveStatus(skill.status)
            })
        }

        await setTimeout(500)
        return this.affectStatuses(io)
    }

    private affectStatuses(io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this._statuses.map(statusElem => {
            switch(statusElem.type) {
                case "Attack":
                    io.emit("anim-attack", {id: this.id, damage: statusElem.factor})
                    this.receiveDamage(statusElem.factor)
                    break
                case "Healing":
                    io.emit("anim-healing", {id: this.id, healing: statusElem.factor})
                    this.receiveHealing(statusElem.factor)
                    break
            }
            if (statusElem.duration) {
                statusElem.duration -= 1
                if (statusElem.duration <= 0) this.removeStatus(statusElem)
            }
        })
    }
    
    private receiveStatus(status: Status) {
        this._statuses.push(status)
        if (this.isStatusBonusOrMalus(status)) {
            switch(status.effect) {
                case "Attack":
                    this._attackBonus += status.factor
                    break
                case "Armor":
                    this._armorBonus += status.factor
                    break
            }
        }
    }
            
    private removeStatus(status: Status) {
        this._statuses = this._statuses.filter(statusElem => status !== statusElem)
        if (this.isStatusBonusOrMalus(status)) {
            switch(status.effect) {
                case "Attack":
                    this._attackBonus -= status.factor
            break
            case "Armor":
                this._armorBonus -= status.factor
                break
            }
        }
    }

    private receiveDamage(damage: number) {
        this._health -= (damage - this._armorBonus)
        if (this._health < 0) this._health = 0
    }

    private receiveHealing(healing: number) {
        this._health += healing
        if (this._health >= this._maxHealth) this._health = this._maxHealth
    }
            
    private isStatusBonusOrMalus(status: Status): status is StatusBonusOrMalus {
        return "effect" in status
    }

    private isSkillStatus(skill: Skill): skill is SkillStatus {
        return "status" in skill
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

    get attackBonus() {
        return this._attackBonus
    }

    get armorBonus() {
        return this._armorBonus
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