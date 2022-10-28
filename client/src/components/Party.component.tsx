import { useState } from 'react'
import { io, Socket } from 'socket.io-client'

const JoinParty = (
    props: {
        socket: Socket
        setIsJoining: (state: boolean) => void
        setSocket: (socket: Socket) => void
        setPartyID: (id: number) => void
    }) => {

    const [inputID, setInputID] = useState(String)

    const changeSocket = () => {
        props.socket.emit("party-change", inputID, (isOpen: boolean) => {
            if (isOpen) {
                props.setSocket(io("http://localhost:4000/" + inputID))
                props.setIsJoining(false)
                props.setPartyID(Number(inputID))
            }
        })
    }

    return (
        <div className="JoinParty">
            <input placeholder="Enter Party" onChange={(e) => setInputID(e.target.value)}/>
            <button onClick={() => changeSocket()}>Enter</button>
            <button onClick={() => props.setIsJoining(false)}>Close</button>
        </div>
    )

}

export default JoinParty