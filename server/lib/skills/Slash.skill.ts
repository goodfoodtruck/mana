import { BloodLossStatus } from "../status/BloodLoss.status"
import { SkillStatus } from "./skill"

export const SlashSkill: SkillStatus = {
    name: "Slash",
    type: "Attack",
    targetCount: 1,
    factor: 2,
    status: BloodLossStatus
}