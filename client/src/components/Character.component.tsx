import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { Unit } from '../interfaces/unit'

const Character = (
    props: {
        character: Unit,
        socket: Socket,
        choices: Array<String>,
        choosing: Boolean,
        choose: (id: string) => void 
    }) => {

    const [damage, setDamage] = useState(Number)
    const [animation, setAnimation] = useState(0)

    props.socket.on("anim-damage", (data: {id: string, damage: number}) => {
        if (data.id === props.character.id) {
            setDamage(data.damage)
            setAnimation(1)
        }
    })

    return (
        <div
            className={`Character ${props.choosing && "choosing"} ${props.choices.includes(props.character.id) && "chosen"}`}
            style={{gridColumn: props.character.position.x, gridRow: props.character.position.y, zIndex: props.character.position.z}}
            onClick={() => props.choose(props.character.id)}>
                <img src={`/assets/img/${props.character.sprite.id}.sprite.png`} data-animation={animation} alt={props.character.id} />
                <span className="Damage" onAnimationEnd={() => setAnimation(0)} data-animation={animation}>{damage}</span>
        </div>
    )
}

export default Character