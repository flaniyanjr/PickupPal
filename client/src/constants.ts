export const FORMATS = ['5v5', '7v7', '9v9', '11v11']
export const DEFAULT_FORMAT = '7v7'
export const MAX_PLAYERS = 40

export const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

// parseInt reads digits from the start and stops at the first non-digit, so parseInt('7v7', 10) returns 7
export function teamSize(format: string): number {
    return parseInt(format, 10)
}

// Two full teams
export function minPlayers(format: string): number {
    return teamSize(format) * 2
}