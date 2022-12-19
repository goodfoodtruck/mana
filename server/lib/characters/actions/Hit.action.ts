import { Action, Attack } from "./action";

export const HitAction: Action = {
    name: "Hit",
    factor: 5,
    targets: 1,
    method: Attack
}