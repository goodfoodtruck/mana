import { Unit } from "./unit"

export interface Status {
    name: string
    factor: number
    effect?: (factor: number, targets: Array<Unit>, turns?: number) => void
    turns: number | { permanent: true }
}