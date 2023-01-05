import { Socket } from "socket.io"
import { Unit } from "../unit"

export default class Druid extends Unit {
    constructor(name: string, socket?: Socket) {
        super(name, {id: "Druid", category: "Small"}, socket)
    }
}