import { Socket } from "socket.io";
import Unit from "../unit";

export default class Sage extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Sage", category: "Small"}, socket)
        this._actions = ["Attack", "MindControl"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "MindControl":
                return this.MindControl(target)
        }
    }

    MindControl(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}