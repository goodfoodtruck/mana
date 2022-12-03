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
                {props.allies.map((ally, idx) => (
                    <div
                        key={ally.id + idx}
                        className={choice === ally.id + idx ? "Character active" : "Character"}
                        style={{gridColumn: ally.position.x, gridRow: ally.position.y}}
                        onClick={() => choose(ally.id + idx)}>
                            <img src={`/assets/img/${ally.sprite.id}.sprite.png`} alt={ally.id} />
                    </div>
                ))}
            </div>
            <div className="side">
                {props.enemies.map((enemy, idx) => (
                    <div
                    key={enemy.id + idx}
                        className={choice === enemy.id + idx ? "Character active" : "Character"}
                        style={{gridColumn: enemy.position.x, gridRow: enemy.position.y}}
                        onClick={() => choose(enemy.id + idx)}>
                            <img src={`/assets/img/${enemy.sprite.id}.sprite.png`} alt={enemy.id} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board