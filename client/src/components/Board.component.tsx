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
            <div className="side left">
                {props.allies.map(character => (
                    <div
                        key={character.id}
                        className={choice === character.id ? "Character active" : "Character"}
                        style={{gridColumn: character.position.x, gridRow: character.position.y, zIndex: character.position.z}}
                        onClick={() => choose(character.id)}>
                            <img src={`/assets/img/${character.sprite.id}.sprite.png`} alt={character.id} />
                    </div>
                ))}
            </div>
            <div className="side right">
                {props.enemies.map(character => (
                    <div
                    key={character.id}
                        className={choice === character.id ? "Character active" : "Character"}
                        style={{gridColumn: character.position.x, gridRow: character.position.y, zIndex: character.position.z}}
                        onClick={() => choose(character.id)}>
                            <img src={`/assets/img/${character.sprite.id}.sprite.png`} alt={character.id} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board