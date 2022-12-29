import { useState } from "react"
import { Socket } from "socket.io-client"
import PlayerStatus from "./PlayerStatus.component"
import { Unit } from "../interfaces/unit"

const Menu = (
    props: {
        socket: Socket,
        allies: Array<Unit>
    }) => {
    const [isMyTurn, setIsMyTurn] = useState(false)
    const [skills, setSkills] = useState(Array<String>)

    const pressButton = (action: String) => {
        if (isMyTurn) {
            props.socket.emit("turn-action", action)
        }
    }

    props.socket.on("turn-state", (myTurn: boolean) => {
        myTurn ? setIsMyTurn(true) : setIsMyTurn(false)
    })

    props.socket.on("actions-info", (skills: Array<String>) => {
        setSkills(skills)
    })

    return (
        <div className='Menu'>
            <div className="container">
                <div className="actions">
                    {isMyTurn && skills.map(skill => (
                        <button key={"#" + skill} className="btn success" onClick={() => pressButton(skill)}>{skill}</button>
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

