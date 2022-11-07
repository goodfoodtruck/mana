import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import JoinParty from "./JoinParty.component"
import Game from "./Game.component"

const InitialSocket = io("http://localhost:4000/")

const Lobby = () => {

    const [socket, setSocket] = useState(io())
    const [partyID, setPartyID] = useState(Number)
    const [participants, setParticipants] = useState(Array<String>)
    const [isJoining, setIsJoining] = useState(false)
    const [inGame, setInGame] = useState(false)
    const mountRef = useRef(false)
    
    const start = () => {
        socket.emit("start")
        setInGame(true)
    }

    useEffect(() => {
        if (!mountRef.current) {
            InitialSocket.on("party-create", (id: number) => {
                setSocket(io("http://localhost:4000/" + id))
                setPartyID(id)
            })
        }

        return () => {
            mountRef.current = true
        }
    })

    socket.on("party-info", (participants: Array<String>) => {
        setParticipants(participants)
    })

    socket.on("game-state", () => {
        setInGame(true)
    })
    
    if (!inGame) {
        return (
            <div className="Lobby">
                <button onClick={start}>Start Game</button>
                <div className="Party">
                    <div className="Join-Party">
                        <button onClick={() => setIsJoining(true)}>Join Party</button>
                        {isJoining && <JoinParty
                            socket={socket}
                            setIsJoining={(state: boolean) => setIsJoining(state)}
                            setSocket={(socket: Socket) => setSocket(socket)}  
                            setPartyID={(id: number) => setPartyID(id)} 
                        />}
                    </div>
                    <div className="Lobby-Party">
                        <h4>ID : {partyID}</h4>
                        <h4>Party :</h4>
                        <ul>
                            {participants.map((participant) => (
                                <li key={participants.indexOf(participant)}>
                                    {participant === socket.id ? participant + " (You)" : participant}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <Game
                socket={socket}
                setInGame={(state: boolean) => setInGame(state)}
            />
        )
    }
}

export default Lobby