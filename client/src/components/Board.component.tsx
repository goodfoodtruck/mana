import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { Unit } from '../interfaces/unit'
import Character from './Character.component'

const Board = (
    props: {
        socket: Socket,
        allies: Array<Unit>,
        enemies: Array<Unit>
    }) => {
        
    const [choices, setChoices] = useState(Array<String>)
    const [choosing, setChoosing] = useState(false)
    const [targetsNeeded, setTargetsNeeded] = useState(Number)

    const choose = (id: string) => {
        if (choosing) {
            if (choices.length < targetsNeeded) {
                setChoices(choices => [...choices, id])
            } else if (choices.length === targetsNeeded) {
                setChoices(choices => [...choices.splice(0, 1), id])
            } else {
                setChoices(choices => choices.filter(choice => choice !== id))
            }
        }
    }

    const confirmChoices = () => {
        props.socket.emit("turn-target-selected", choices)
        setChoosing(false)
        setChoices([])
    }

    props.socket.once("turn-target", (targetting: number) => {
        setTargetsNeeded(targetting)
        setChoosing(true)
    })

    return (
        <div className="Board">
            <div className="side left">
                {props.allies.map((character, index) => (
                    <Character
                        key={index}
                        character={character}
                        socket={props.socket}
                        choices={choices}
                        choosing={choosing}
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
                        choices={choices}
                        choosing={choosing}
                        choose={(id: string) => choose(id)}
                    />
                ))}
            </div>
            {choosing && <div className="Choice">
                <div className="container dark">
                    <button className="btn error" onClick={() => confirmChoices()}>Lock selection</button>
                </div>
            </div>}
        </div>
    )
}

export default Board