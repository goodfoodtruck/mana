import { useState } from 'react'
import { io, Socket } from 'socket.io-client'

const JoinParty = (
    props: {
        socket: Socket
        setSocket: (socket: Socket) => void
        setPartyID: (id: number) => void
    }) => {

    const [inputID, setInputID] = useState(String)

    const changeSocket = () => {
        props.socket.emit("party-change", inputID, (isOpen: boolean) => {
            if (isOpen) {
                props.setSocket(io("http://localhost:4000/" + inputID))
                props.setPartyID(Number(inputID))
            }
        })
    }

    return (
        <div className="Join">
            <div className="container">
                <input className="prompt" placeholder="Enter Party ID" onChange={(e) => setInputID(e.target.value)}/>
                <button className="btn success" onClick={() => changeSocket()}>Join</button>
            </div>    
        </div>
    )

}

export default JoinParty