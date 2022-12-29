import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Unit } from "../characters/unit"
import { Status } from "../status/status"

export class Skill {
    name: string
    targetCount: number
    event!: string
    useSkill!: (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit, status?: Status) => void
    damageOrHealing?: number
    status?: Status

    constructor(name: string, targetCount: number, damageOrHealing?: number, status?: Status) {
        this.name = name
        this.targetCount = targetCount
        this.damageOrHealing = damageOrHealing
        this.status = status
    }
}

export class AttackSkill extends Skill {
    event = "anim-attack"
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit, status?: Status) => {
        this.damageOrHealing! += (actor?.attackBonus ? actor.attackBonus : 0)
        targets.map(target => {
            io.emit(this.event, {id: target.id, damageOrHealing: this.damageOrHealing})
            target.receiveDamage(this.damageOrHealing!)
        })
    }
}

export class HealSkill extends Skill {
    event = "anim-heal"
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit, status?: Status) => {
        targets.map(target => {
            io.emit(this.event, {target: target, damageOrHealing: this.damageOrHealing})
            target.receiveHealing(this.damageOrHealing!)
        })
    }
}

export class StatusSkill extends Skill {
    event = "anim-status"
    useSkill = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, targets: Array<Unit>, actor?: Unit, status?: Status) => {
        targets.map(target => {
            io.emit(this.event, {target: target, status: status})
            target.receiveStatus(status!)
        })
    }
}