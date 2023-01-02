import { StatusSkill } from "./skill"
import { EnragedStatus } from "../status/Enraged.status"

export const RageSkill: StatusSkill = new StatusSkill("Rage", 1, new EnragedStatus())