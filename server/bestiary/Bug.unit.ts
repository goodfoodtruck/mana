import Unit from "../unit";

export default class Bug extends Unit {
    constructor() {
        super("Bug")
        this._actions = ["Attack", "Spit"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "Spit":
                return this.Spit(target)
        }
    }

    Spit(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}