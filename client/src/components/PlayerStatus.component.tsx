import { Unit } from "../interfaces/unit"

const PlayerStatus = (
    props: {
        player: Unit
    }
) => {

    return (
        <div className="PlayerStatus">
            <span className="Name">{props.player.name}</span>
            <div className="HealthBar">
                <span className="Health" style={{width: `${props.player.health}%`}}></span>
            </div>
        </div>
    )
}

export default PlayerStatus