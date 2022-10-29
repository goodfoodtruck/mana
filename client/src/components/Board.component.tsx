import { useState } from 'react'
import { Socket } from 'socket.io-client'

const Board = (
    props: {
        socket: Socket,
        target: String,
        setTarget: (target: string) => void
    }) => {

    const [allies, setAllies] = useState(Array<String>)
    const [enemies, setEnemies] = useState(Array<String>)
    const [choice, setChoice] = useState(String)

    const choose = (target: string) => {
        target === choice ? setChoice("") : setChoice(target)
        target === props.target ? props.setTarget("") : props.setTarget(target)
    }

    props.socket.on("board-info", (data: {allies: Array<String>, enemies: Array<String>}) => {
        setAllies(data.allies)
        setEnemies(data.enemies)
    })

    return (
        <div className='Board'>
            <div className='side Left'>
                {allies.map((ally) => (
                    <div key={allies.indexOf(ally)}>
                        <div
                            className={choice === ally ? "Character active" : "Character"}
                            onClick={() => choose(ally.toString())}>
                        </div>
                    </div>
                ))}
            </div>
            <div className='side Right'>
                {enemies.map((enemy) => (
                    <div key={enemies.indexOf(enemy)}>
                        <div
                            className={choice === enemy ? "Character active" : "Character"}
                            onClick={() => choose(enemy.toString())}>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board