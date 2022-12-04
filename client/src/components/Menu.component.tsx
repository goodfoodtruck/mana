import { useState } from "react"
import { Socket } from "socket.io-client"
import PlayerStatus from "./PlayerStatus.component"
import { Unit } from "../interfaces/unit"

const Menu = (
    props: {
        socket: Socket,
        allies: Array<Unit>,
        target: string
    }) => {
    const [isMyTurn, setIsMyTurn] = useState(false)
    const [actions, setActions] = useState(Array<string>)

    const pressButton = (action: string) => {
        if (isMyTurn && props.target) {
            props.socket.emit("press", {choice: action, target: props.target})
        }
    }

    props.socket.on("turn-state", (myTurn: boolean) => {
        if (myTurn) {
            setIsMyTurn(true)
        } else {
            setIsMyTurn(false)
        }
    })

    props.socket.on("actions-info", (actions: string[]) => {
        setActions(actions)
    })

    return (
        <div className='Menu'>
            <div className="container">
                <div className="actions">
                    {isMyTurn && actions.map(action => (
                        <button key={action} className="btn success" onClick={() => pressButton(action)}>{action}</button>
                    ))}
                    {!isMyTurn && <div>Wait for your round</div>}
                </div>
            </div>
            <div className="container">
                <div className="status">
                    {props.allies.map(ally => (
                        <PlayerStatus key={ally.name} player={ally} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Menu

