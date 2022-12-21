import { Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Unit, Bonuses } from "../unit";


export interface Action {
    name: string
    factor?: number
    targets: number
    method: (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>, bonuses?: Bonuses) => void
}

export const Attack = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>, bonuses?: Bonuses) => {
    const damage = 1 * factor + (bonuses ? bonuses.attack : 0)
    targets.map(target => {
        target.receiveDamage(damage)
        io.emit("anim-damage", {id: target.id, damage: damage})
    })
}

export const Heal = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>, bonuses?: Bonuses) => {
    const healing = 1 * factor
    targets.map(target => {
        target.receiveHealing(healing)
        io.emit("anim-healing", {id: target.id, healing: healing})
    })
}