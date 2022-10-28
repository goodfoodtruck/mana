import { useState } from 'react'
import { Socket } from 'socket.io-client'

const Board = (
    props: {
        socket: Socket,
        setTarget: (target: string) => void
    }) => {

    const [allies, setAllies] = useState(Array<String>)
    const [enemies, setEnemies] = useState(Array<String>)

    const choose = () => {
        console.log("lol")
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
                            className="Character"
                            onClick={() => {
                                props.setTarget(ally.toString())
                            }}>
                        </div>
                    </div>
                ))}
            </div>
            <div className='side Right'>
                {enemies.map((enemy) => (
                    <div key={enemies.indexOf(enemy)}>
                        <div
                            className="Character"
                            onClick={() => {
                                props.setTarget(enemy.toString())
                                choose()
                            }}>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board