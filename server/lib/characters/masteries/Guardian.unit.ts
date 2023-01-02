import { Socket } from "socket.io";
import { Unit } from "../unit";
import { HitSkill } from "../../skills/Hit.skill";
import { RageSkill } from "../../skills/Rage.skill";

export default class Guardian extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Guardian", category: "Small"}, socket)
        this._skills = [HitSkill, RageSkill]
    }
}