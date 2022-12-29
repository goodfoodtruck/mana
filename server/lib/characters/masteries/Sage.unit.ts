import { Socket } from "socket.io"
import { Unit } from "../unit"
import { CareSkill } from "../../skills/Care.skill"

export default class Sage extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Sage", category: "Small"}, socket)
        this._skills = [CareSkill]
    }
}