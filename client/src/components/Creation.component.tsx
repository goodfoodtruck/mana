const Creation = (
    props: {
        setName: (name: string) => void
        setMastery: (mastery: string) => void
        setIsCreated: (state: boolean) => void
    }
) => {
    const masteries = ["Guardian", "Samurai", "Sage", "Druid"]

    return (
        <div className="Creation">
            <form onSubmit={() => props.setIsCreated(true)}>
                {masteries.map(mastery => (
                    <div key={mastery} className="Mastery" onClick={() => props.setMastery(mastery)}>{mastery}</div>
                ))}
                <input placeholder="Enter Name" onChange={(e) => props.setName(e.target.value)} required />
                <input type="submit" value="Go" />
            </form>
        </div>
    )
}

export default Creation