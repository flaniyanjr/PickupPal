export interface PickupGame {
    id: number
    location: string
    city: string
    state: string
    date: string
    time: string
    format: string
    max_players: number
    latitude: number | null
    longitude: number | null
    sport: string
    image: string
    total_attendees: number
    creator_id: number | null
    player_signups?: PlayerSignup[]
    users?: User[]
}

export interface PlayerSignup {
    id: number
    name: string
    preferred_position: string
    user_id: number
    pickup_game_id: number
    user: User
    pickup_game: PickupGame
}

export interface User {
    id: number
    username: string
    email?: string
    created_at: string
    updated_at: string
    player_signups?: PlayerSignup[]
    pickup_games?: PickupGame[]
}
