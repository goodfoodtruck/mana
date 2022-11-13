import { Socket } from "socket.io";
import Unit from "../unit";

export default class Guardian extends Unit {
    constructor(id: string, socket?: Socket) {
        super(id, socket)
        this._actions = ["Attack", "Smash"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "Smash":
                return this.Smash(target)
        }
    }

    Smash(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}