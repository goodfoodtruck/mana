export interface Unit {
    name: string,
    id: string,
    health: number,
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