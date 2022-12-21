import { Socket } from "socket.io";
import { Unit } from "../unit";

export default class Sage extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Sage", category: "Small"}, socket)
    }
}