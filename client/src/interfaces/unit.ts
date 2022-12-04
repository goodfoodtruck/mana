export interface Unit {
    health: number,
    id: string,
    sprite: {
        id: string,
        category: "Small" | "Medium" | "Large"
    },
    position: {
        x: number,
        y: number,
        z: number
    }
}