import { useState } from "react"
import { Socket } from "socket.io-client"

const Menu = (
    props: {
        socket: Socket, 
        target: string
    }) => {
    const [isMyTurn, setIsMyTurn] = useState(false)
    const [text, setText] = useState(String)

    const pressButton = () => {
        if (isMyTurn) {
            props.socket.emit("press", props.target)
        }
    }

    props.socket.on("turn-state", (myTurn: boolean) => {
        if (myTurn) {
            setIsMyTurn(true)
            setText("Choose target")
        } else {
            setIsMyTurn(false)
            setText("Wait for your round")
        }
    })

    return (
        <div className='Menu'>
            <button onClick={pressButton}>{text}</button>
        </div>
    )
}

export default Menu

