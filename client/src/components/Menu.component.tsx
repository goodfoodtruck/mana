import { useState } from "react"
import { Socket } from "socket.io-client"
import PlayerStatus from "./PlayerStatus.component"
import { Unit } from "../interfaces/unit"
import { Action } from "../interfaces/action"

const Menu = (
    props: {
        socket: Socket,
        allies: Array<Unit>
    }) => {
    const [isMyTurn, setIsMyTurn] = useState(false)
    const [actions, setActions] = useState(Array<Action>)

    const pressButton = (action: Action) => {
        if (isMyTurn) {
            props.socket.emit("turn-action", action)
        }
    }

    props.socket.on("turn-state", (myTurn: boolean) => {
        myTurn ? setIsMyTurn(true) : setIsMyTurn(false)
    })

    props.socket.on("actions-info", (actions: Array<Action>) => {
        setActions(actions)
    })

    return (
        <div className='Menu'>
            <div className="container">
                <div className="actions">
                    {isMyTurn && actions.map(action => (
                        <button key={action.name} className="btn success" onClick={() => pressButton(action)}>{action.name}</button>
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

