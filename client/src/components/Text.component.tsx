import { useState } from 'react'
import { Socket } from 'socket.io-client'

const Text = (props: { socket: Socket }) => {

    const [message, setMessage] = useState(String)
    var messageTimeout: NodeJS.Timeout

    props.socket.on("message", (message: string) => {
        clearTimeout(messageTimeout)
        setMessage(message)
        messageTimeout = setTimeout(() => setMessage(""), 2500)
    })

    if (message) {
        return (
            <div className='Text'>
                <div className="container">
                    <p className="message">{message}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default Text