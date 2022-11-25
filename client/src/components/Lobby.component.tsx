import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import JoinParty from "./JoinParty.component"
import Game from "./Game.component"


const Lobby = (
    props: {
        name: String
        mastery: String
    }
) => {
    
    const [socket, setSocket] = useState(io())
    const [partyID, setPartyID] = useState(Number)
    const [participants, setParticipants] = useState(Array<String>)
    const [inGame, setInGame] = useState(false)
    const InitialSocket = io("http://localhost:4000/")
    const mountRef = useRef(false)
    
    const start = () => {
        socket.emit("launch-game")
    }

    useEffect(() => {
        if (!mountRef.current) {
            InitialSocket.on("party-create", (id: number) => {
                setSocket(io("http://localhost:4000/" + id))
                setPartyID(id)
            })
        }

        socket.on("connect", () => {
            socket.emit("player-info", {name: props.name, mastery: props.mastery})
        })

        return () => {
            mountRef.current = true
        }
    })

    socket.on("party-info", (participants: Array<String>) => {
        setParticipants(participants)
    })

    socket.on("start-game", () => {
        setInGame(true)
    })
    
    if (!inGame) {
        return (
            <div className="Lobby">
                <div className="container">
                    <label className="title">[Party n°{partyID}]</label>
                    <div className="Party">
                        {participants.map((participant) => (
                            <div className="participant" key={participants.indexOf(participant)}>
                                {participant === props.name ? participant + " (You)" : participant}
                            </div>
                        ))}
                    </div>
                    <button className="btn primary" onClick={start}>Start</button>
                </div>
                <JoinParty
                    socket={socket}
                    setSocket={(socket: Socket) => setSocket(socket)}  
                    setPartyID={(id: number) => setPartyID(id)} 
                />
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