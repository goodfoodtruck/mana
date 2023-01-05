export interface Status {
    name: string
    type?: "Attack" | "Healing"
    factor: number
    duration?: number
}

export interface StatusBonusOrMalus extends Status {
    effect: "Attack" | "Armor"
}