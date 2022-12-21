import { Attack, Heal } from "../actions/action"
import { Unit } from "../unit"

export type Status<Method extends "Action" | "Effect"> = {
    name: string
    factor: number
    method: StatusMethod<Method>
    duration?: number
}

type StatusMethod<Method extends "Action" | "Effect"> = Method extends "Action"
    ? typeof Attack | typeof Heal
    : typeof AttackBonus | typeof ArmorBonus

export const AttackBonus = (target: Unit, factor: number) => {
    target.attackBonus = factor
}

export const ArmorBonus = (target: Unit, factor: number) => {
    target.armorBonus = factor
}

