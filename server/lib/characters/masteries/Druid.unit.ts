import { Socket } from "socket.io";
import Unit from "../unit";

export default class Druid extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Druid", category: "Small"}, socket)
        this._actions = ["Attack", "Scratch"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "Scratch":
                return this.Scratch(target)
        }
    }

    Scratch(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}