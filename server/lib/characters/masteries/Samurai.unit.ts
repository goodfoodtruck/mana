import { Socket } from "socket.io";
import { Unit } from "../unit";
import { HitSkill } from "../../skills/Hit.skill";
import { SlashSkill } from "../../skills/Slash.skill";

export default class Samurai extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Samurai", category: "Small"}, socket)
        this._skills = [HitSkill, SlashSkill]
    }
}