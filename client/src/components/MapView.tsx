import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PickupGame } from "../types"
import { pinIcon } from "../mapIcon.ts"

interface MapViewProps {
    games: PickupGame[]
}


// Moves the map so every pin is visible. Renders nothing itself.
function FitToGames({ points }: { points: [number, number][] }) {
    const map = useMap()
    // A string copy of the points, so the effect only runs when the coordinates change
    const key = JSON.stringify(points)

    useEffect(() => {
        const pts = JSON.parse(key) as [number, number][]
        if (pts.length === 0) {
            return
        }
        map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 13 })
    }, [map, key])

    return null
}

function MapView({ games }: MapViewProps) {

    // Coordinates of every game that has them
    const points = games.flatMap((game): [number, number][] =>
        game.latitude === null || game.longitude === null
            ? []
            : [[game.latitude, game.longitude]]
    )

    const markers = games.flatMap(game => {
        if (game.latitude === null || game.longitude === null) {
            return []
        }
        return [
            <Marker key={game.id} position={[game.latitude, game.longitude]} icon={pinIcon}>
                <Popup>
                    <strong>{game.location}</strong>
                    <br />
                    {game.city}, {game.state}
                    <br />
                    {game.date} at {game.time}
                    <br />
                    {game.format}, {game.total_attendees}/{game.max_players} signed up
                </Popup>
            </Marker>
        ]
    })

    return (
        <MapContainer
            center={[39.8, -75.8]}
            zoom={7}
            style={{ height: '400px', width: '90%', margin: '20px auto' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToGames points={points} />
            {markers}
        </MapContainer>
    )
}

export default MapView