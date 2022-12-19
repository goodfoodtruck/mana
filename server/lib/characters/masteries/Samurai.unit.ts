import { Socket } from "socket.io";
import Unit from "../unit";

export default class Samurai extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Samurai", category: "Small"}, socket)
    }
}