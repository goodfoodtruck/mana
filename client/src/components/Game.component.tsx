import { Socket } from 'socket.io-client'
import { Unit } from '../interfaces/unit'
import Text from './Text.component'
import Board from './Board.component'
import Menu from './Menu.component'
import { useState } from 'react'

const Game = (
    props: {
        socket: Socket,
        setInGame: (state: boolean) => void
    }) => {

    const [allies, setAllies] = useState(Array<Unit>)
    const [enemies, setEnemies] = useState(Array<Unit>)
    const [target, setTarget] = useState(String)

    props.socket.on("game-state", (state: boolean) => {
        props.setInGame(state)
    })

    props.socket.on("game-info", (data: {allies: Array<Unit>, enemies: Array<Unit>}) => {
        setAllies(data.allies)
        setEnemies(data.enemies)
    })

    return (
        <div className="Game">
            <Text socket={props.socket} />
            <Board
                socket={props.socket}
                allies={allies}
                enemies={enemies}
                target={target}
                setTarget={(target: string) => setTarget(target)}
            />
            <Menu
                socket={props.socket}
                allies={allies}
                target={target}
            />
        </div>
    )
}

export default Game
