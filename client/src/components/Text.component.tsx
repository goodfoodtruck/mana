import { useState } from 'react'
import { Socket } from 'socket.io-client'

const Text = (props: { socket: Socket }) => {

    const [message, setMessage] = useState("Game is ready !")

    props.socket.on("message", (message: string) => {
        setMessage(message)
    })

    return (
        <div className='Text'>
            {message}
        </div>
    )
}

export default Text