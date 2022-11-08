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
    const [text, setText] = useState(String)

    const pressButton = () => {
        if (isMyTurn && props.target) {
            props.socket.emit("press", props.target)
        }
    }

    props.socket.on("turn-state", (myTurn: boolean) => {
        if (myTurn) {
            setIsMyTurn(true)
            setText("Choose target")
        } else {
            setIsMyTurn(false)
            setText("Wait for your round")
        }
    })

    return (
        <div className='Menu'>
            <div className="actions">
                <div className="Button" onClick={pressButton}>{text}</div>
            </div>
            <div className="status">
                {props.allies.map(ally => (
                    <PlayerStatus key={ally.id} player={ally} />
                ))}
            </div>
        </div>
    )
}

export default Menu

