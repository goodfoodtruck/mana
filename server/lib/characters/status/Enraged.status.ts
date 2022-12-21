import { AttackBonus, Status } from "./status";

export var EnragedStatus: Status<"Effect"> = {
    name: "Enraged",
    factor: 5,
    method: AttackBonus
}