import { Socket } from "socket.io";
import Unit from "../unit";

export default class Samurai extends Unit {
    constructor(id: string, socket?: Socket) {
        super(id, socket)
        this._actions = ["Attack", "Slash"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "Slash":
                return this.Slash(target)
        }
    }

    Slash(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}