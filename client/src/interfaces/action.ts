import { Status } from "./status"
import { Unit } from "./unit"

export interface Action {
    name: string
    factor?: number
    status?: Status
    targets: number
    method: (factor: number, targets: Array<Unit>) => void
}