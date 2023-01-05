import { SkillStatus } from "./skill"
import { EnragedStatus } from "../status/Enraged.status"

export const RageSkill: SkillStatus = {
    name: "Rage",
    type: "Status",
    targetCount: 1,
    factor: 2,
    status: EnragedStatus
}