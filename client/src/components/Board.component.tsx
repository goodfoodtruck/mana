import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { Unit } from '../interfaces/unit'
import Character from './Character.component'

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
                {props.allies.map((character, index) => (
                    <Character
                        key={index}
                        character={character}
                        socket={props.socket}
                        choice={choice}
                        choose={(id: string) => choose(id)}
                    />
                ))}
            </div>
            <div className="side right">
                {props.enemies.map((character, index) => (
                    <Character
                        key={index}
                        character={character}
                        socket={props.socket}
                        choice={choice}
                        choose={(id: string) => choose(id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Board