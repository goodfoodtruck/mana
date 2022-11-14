import { useState } from 'react'
import './App.scss'
import Creation from './components/Creation.component'
import Lobby from './components/Lobby.component'

const App = () => {

    const [name, setName] = useState(String)
    const [mastery, setMastery] = useState(String)
    const [isCreated, setIsCreated] = useState(false)

    if (!isCreated) {
        return (
            <div className="App">
                <main>
                    <Creation
                        setName={(name: string) => setName(name)}
                        setMastery={(mastery: string) => setMastery(mastery)}
                        setIsCreated={(state: boolean) => setIsCreated(state)}
                    />
                </main>
            </div>
        )
    } else {
        return (
            <div className="App">
                <main>
                    <Lobby
                        name={name}
                        mastery={mastery}
                    />
                </main>
            </div>
        )
    }
}

export default App
