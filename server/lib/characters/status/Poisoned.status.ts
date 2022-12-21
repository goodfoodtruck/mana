import { Attack } from "../actions/action";
import { Status } from "./status";

export var PoisonedStatus: Status<"Action"> = {
    name: "Poison",
    factor: 3,
    method: Attack,
    duration: 2
}