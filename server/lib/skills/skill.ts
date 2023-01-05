import { Status } from "../status/status"

export interface Skill {
    name: string
    type: "Attack" | "Healing" | "Status"
    targetCount: number
    factor: number
}

export interface SkillStatus extends Skill {
    status: Status
}