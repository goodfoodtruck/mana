import { useState } from 'react'
import './App.scss'
import Lobby from './components/Lobby.component'

const App = () => {

    const [name, setName] = useState(String)
    const [isName, setIsName] = useState(false)

    if (!isName) {
        return (
            <div className="App">
                <main>
                    <input placeholder="Enter Name" onChange={(e) => setName(e.target.value)}></input>
                    <button onClick={() => setIsName(true)}>Go</button>
                </main>
            </div>
        )
    } else {
        return (
            <div className="App">
                <main>
                    <Lobby name={name} />
                </main>
            </div>
        )
    }
}

export default App
