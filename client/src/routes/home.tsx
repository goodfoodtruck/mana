import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="Home">
            <div className="title">
                <h1>M A N A</h1>
                <h3>Many Adventures Need Adventurers</h3>
            </div>
            <div className="menu">
                <div className="card container">
                    <img alt="multiplayer" src="/assets/img/Multiplayer.icon.png" />
                    <p>Create your character, prepare yourself, build or join a party and make your own path</p>
                    <div className="btn">
                        <Link to={"creation"}>
                            Play
                        </Link>
                    </div>
                </div>
                <div className="card container">
                    <img alt="question" src="/assets/img/Question.icon.png" />
                    <p>Mana is a turn-based multiplayer RPG made so I can understand more about gamedev and
                        application development in general. You can learn more on it on the repository below.
                    </p>
                    <div className="btn">
                        <a href="https://github.com/goodfoodtruck/mana">GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home