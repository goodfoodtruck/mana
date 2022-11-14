import Unit from "../unit";

export default class Snake extends Unit {
    constructor() {
        super("Snake")
        this._actions = ["Attack", "Fangs"]
    }

    action(choice: string, target: Unit) {
        switch(choice) {
            case "Attack":
                return this.attack(target)
            case "Fangs":
                return this.Fangs(target)
        }
    }

    Fangs(target: Unit) {
        const damage = 50
        target.receiveDamage(damage)
        return damage
    }
}