import { Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Unit from "../unit";
import { Status } from "../status/status";

export interface Action {
    name: string
    factor?: number
    status?: Status
    targets: number
    method: (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>) => void
}

export const Attack = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>) => {
    const damage = 1 * factor
    targets.map(target => {
        target.receiveDamage(damage)
        io.emit("anim-damage", {id: target.id, damage: damage})
    })
}

export const Heal = (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>) => {
    const healing = 1 * factor
    targets.map(target => {
        target.receiveHealing(healing)
        io.emit("anim-healing", {id: target.id, healing: healing})
    })
}