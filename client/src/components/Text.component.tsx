import { useState } from 'react'
import { Socket } from 'socket.io-client'

const Text = (props: { socket: Socket }) => {

    const [message, setMessage] = useState("Game is ready !")

    props.socket.on("message", (message: string) => {
        setMessage(message)
    })

    return (
        <div className='Text'>
            <div className="container">
                <p className="message">{message}</p>
            </div>
        </div>
    )
}

export default Text