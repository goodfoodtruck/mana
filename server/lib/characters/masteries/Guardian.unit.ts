import { Socket } from "socket.io";
import Unit from "../unit";

export default class Guardian extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Guardian", category: "Small"}, socket)
    }
}