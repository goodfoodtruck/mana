import { Socket } from 'socket.io-client'
import Text from './Text.component'
import Board from './Board.component'
import Menu from './Menu.component'
import { useState } from 'react'

const Game = (
    props: {
        socket: Socket,
        setInGame: (state: boolean) => void
    }) => {

    const [target, setTarget] = useState(String)

    props.socket.on("game-state", (state: boolean) => {
        props.setInGame(state)
    })

    return (
        <div className="Game">
            <Text socket={props.socket} />
            <Board socket={props.socket} setTarget={(target: string) => setTarget(target)} />
            <Menu socket={props.socket} target={target} />
        </div>
    )
}

export default Game
