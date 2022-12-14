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

    const [damageOrHealing, setDamageOrHealing] = useState(Number)
    const [type, setType] = useState(String)
    const [animation, setAnimation] = useState(0)

    props.socket.on("anim-attack", (data: {id: string, damage: number}) => {
        if (data.id === props.character.id) {
            setType("damage")
            setDamageOrHealing(data.damage)
            setAnimation(1)
        }
    })

    props.socket.on("anim-heal", (data: {id: string, healing: number}) => {
        if (data.id === props.character.id) {
            setType("healing")
            setDamageOrHealing(data.healing)
            setAnimation(2)
        }
    })

    return (
        <div
            className={`Character ${props.choosing && "choosing"} ${props.choices.includes(props.character.id) && "chosen"}`}
            style={{gridColumn: props.character.position.x, gridRow: props.character.position.y, zIndex: props.character.position.z}}
            onClick={() => props.choose(props.character.id)}>
                <img src={`/assets/img/${props.character.sprite.id}.sprite.png`} data-animation={animation} alt={props.character.id} />
                <span className="DamageOrHealing" onAnimationEnd={() => setAnimation(0)} data-animation={animation} data-type={type}>{damageOrHealing}</span>
        </div>
    )
}

export default Character