import { StatusSkill } from "./skill"
import { BloodLossStatus } from "../status/BloodLoss.status"

export const ScratchSkill: StatusSkill = new StatusSkill("Scratch", 1, new BloodLossStatus())