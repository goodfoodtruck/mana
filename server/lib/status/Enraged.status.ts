import { AttackBonus } from "./status"

export class EnragedStatus extends AttackBonus {
    constructor() {
        super("Enraged", 2, 3)
    }
}