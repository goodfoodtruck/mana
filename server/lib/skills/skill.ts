import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Unit } from "../characters/unit"
import { Status } from "../status/status"

export class Skill {
    name: string
    targetCount: number
    event!: string
    useSkill!: (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit) => void

    constructor(name: string, targetCount: number) {
        this.name = name
        this.targetCount = targetCount
    }
}

export class AttackSkill extends Skill {
    damageOrHealing: number
    event = "anim-attack"
    constructor(name: string, targetCount: number, damageOrHealing: number) {
        super(name, targetCount)
        this.damageOrHealing = damageOrHealing
    }
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit) => {
        this.damageOrHealing! += (actor?.attackBonus ? actor.attackBonus : 0)
        targets.map(target => {
            io.emit(this.event, {id: target.id, damage: this.damageOrHealing})
            target.receiveDamage(this.damageOrHealing!)
        })
    }
}

export class HealSkill extends Skill {
    damageOrHealing: number
    event = "anim-heal"
    constructor(name: string, targetCount: number, damageOrHealing: number) {
        super(name, targetCount)
        this.damageOrHealing = damageOrHealing
    }
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit) => {
        targets.map(target => {
            io.emit(this.event, {id: target.id, healing: this.damageOrHealing})
            target.receiveHealing(this.damageOrHealing!)
        })
    }
}

export class StatusSkill extends Skill {
    status: Status
    event = "anim-status"
    constructor(name: string, targetCount: number, status: Status) {
        super(name, targetCount)
        this.status = status
    }
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit) => {
        targets.map(target => {
            io.emit(this.event, {id: target.id, status: this.status})
            target.receiveStatus(this.status.create())
        })
    }
}