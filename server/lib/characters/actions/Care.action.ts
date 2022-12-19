import { Action, Heal } from "./action";

export const CareAction: Action = {
    name: "Care",
    factor: 6,
    targets: 1,
    method: Heal
}