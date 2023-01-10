import { useState } from "react"

const Creation = (
    // props: {
    //     setName: (name: string) => void
    //     mastery: String
    //     setMastery: (mastery: string) => void
    //     setIsCreated: (state: boolean) => void
    // }
) => {
    const [choice, setChoice] = useState(String)
    const masteries = ["Guardian", "Samurai", "Sage", "Druid"]

    // const choose = (mastery: string) => {
    //     mastery === choice ? setChoice("") : setChoice(mastery)
    //     mastery === props.mastery ? props.setMastery("") : props.setMastery(mastery)
    // }

    return (
        <div className="Creation">
            <div className="container">
                <label className="title">[Choose your class]</label>
                <form >
                    <div className="Masteries">
                        {masteries.map(mastery => (
                            <div key={mastery} className={choice === mastery ? "Mastery active" : "Mastery"} >
                                <img src={`assets/img/${mastery}.icon.png`} alt={mastery} />
                                {mastery}
                            </div>
                        ))}
                    </div>
                    <input className="prompt" placeholder="Enter Name" required />
                    <input className="btn primary" type="submit" value="Start" />
                </form>
            </div>
        </div>
    )
}

export default Creation