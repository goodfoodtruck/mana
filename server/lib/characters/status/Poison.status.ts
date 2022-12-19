import { Attack } from "../actions/action";
import { Status } from "./status";

export const PoisonStatus: Status = {
    name: "Poison",
    factor: 3,
    effect: Attack,
    turns: { permanent: true }
}