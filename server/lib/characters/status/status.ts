import { Namespace } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Unit from "../unit"

export interface Status {
    name: string
    factor: number
    effect?: (io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, factor: number, targets: Array<Unit>, turns?: number) => void
    turns: number | { permanent: true }
}