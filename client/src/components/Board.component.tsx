import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { Unit } from '../interfaces/unit'

const Board = (
    props: {
        socket: Socket,
        allies: Array<Unit>,
        enemies: Array<Unit>,
        target: String,
        setTarget: (target: string) => void
    }) => {

    const [choice, setChoice] = useState(String)

    const choose = (target: string) => {
        target === choice ? setChoice("") : setChoice(target)
        target === props.target ? props.setTarget("") : props.setTarget(target)
    }
    
    return (
        <div className="Board">
            <div className="side">
                {props.allies.map((ally) => (
                    <div
                        key={ally.id}
                        className={choice === ally.id ? "Character active" : "Character"}
                        onClick={() => choose(ally.id)}>
                    </div>
                ))}
            </div>
            <div className="side">
                {props.enemies.map((enemy) => (
                    <div
                        key={enemy.id}
                        className={choice === enemy.id ? "Character active" : "Character"}
                        onClick={() => choose(enemy.id)}>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board