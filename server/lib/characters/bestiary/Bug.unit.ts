import { Unit } from "../unit";

export default class Bug extends Unit {
    constructor() {
        super("Bug", {id: "Bug", category: "Medium"})
    }
}