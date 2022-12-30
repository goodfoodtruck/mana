import { Socket } from "socket.io";
import { Unit } from "../unit";
import { ScratchSkill } from "../../skills/Scratch.skill";
import { HitSkill } from "../../skills/Hit.skill";

export default class Druid extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Druid", category: "Small"}, socket)
        this._skills = [HitSkill, ScratchSkill]
    }
}