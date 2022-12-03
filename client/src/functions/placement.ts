import { Unit } from "../interfaces/unit"

export const placement = (characters: Array<Unit>) => {
    const grid: Array<Unit | undefined> = [
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined
    ]

    for (const character of characters) {
        var place = undefined
        while(true) {
            place = Math.floor(Math.random() * (15 - 1) + 0)
            if (character.sprite.category === "Small") {
                if (grid[place] === undefined) {
                    grid[place] = character
                    character.position = {
                        x: place % 4 + 1,
                        y: Math.floor(place / 4) + 1
                    }
                    break
                }
            }
            if (character.sprite.category === "Medium") {
                if (grid[place] === undefined && grid[place + 1] === undefined && grid[place - 1] === undefined && grid[place - 4] === undefined) {
                    grid[place] = character
                    character.position = {
                        x: place % 4 + 1,
                        y: Math.floor(place / 4) + 1
                    }
                    break
                }
            }
            if (character.sprite.category === "Large") {
                if (grid[place] === undefined && grid[place + 1] === undefined && grid[place - 1] === undefined && grid[place - 5] === undefined && grid[place - 4] === undefined && grid[place + 5] === undefined) {
                    grid[place] = character
                    character.position = {
                        x: place % 4 + 1,
                        y: Math.floor(place / 4) + 1
                    }
                    break
                }
            }
        }
    }
    return characters
}