import { Unit } from "../characters/unit"

export class Status {
    name: string
    factor: number
    duration?: number
    constructor(name: string, factor: number, duration?: number) {
        this.name = name
        this.factor = factor
        this.duration = duration
    }
    create() {
        return new (this.constructor as new () => this)()
    }
}

export class StatusAttackOrHeal extends Status {
    event!: string
    action!: (target: Unit) => void
}

export class StatusAttack extends StatusAttackOrHeal {
    event = "anim-attack"
    action = (target: Unit) => {
        target.receiveDamage(this.factor)
    }
}

export class StatusHeal extends StatusAttackOrHeal {
    event = "anim-heal"
    action = (target: Unit) => {
        target.receiveHealing(this.factor)
    }
}

export class StatusBonusOrMalus extends Status {
    affect!: (target: Unit) => void
    relieve!: (target: Unit) => void
}

export class AttackBonus extends StatusBonusOrMalus {
    affect = (target: Unit) => {
        target.attackBonus += this.factor
    }
    relieve = (target: Unit) => {
        target.attackBonus -= this.factor
    }
}

export class ArmorBonus extends StatusBonusOrMalus {
    affect = (target: Unit) => {
        target.armorBonus += this.factor
    }
    relieve = (target: Unit) => {
        target.armorBonus -= this.factor
    }
}