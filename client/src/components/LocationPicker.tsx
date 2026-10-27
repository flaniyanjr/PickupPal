import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { pinIcon } from "../mapIcon.ts"

interface LocationPickerProps {
    latitude: number | null
    longitude: number | null
    onPick: (latitude: number, longitude: number) => void
}

// Listens for clicks on the map. Renders nothing itself.
function ClickHandler({ onPick }: { onPick: (latitude: number, longitude: number) => void }) {
    useMapEvents({
        click(e) {
            // wrap() keeps longitude between -180 and 180 if the map was dragged around the world
            const { lat, lng } = e.latlng.wrap()
            onPick(lat, lng)
        }
    })
    return null
}

function LocationPicker({ latitude, longitude, onPick }: LocationPickerProps) {
    return (
        <MapContainer
            center={[39.5, -98.35]}
            zoom={4}
            style={{ height: '300px', width: '70%', margin: '10px auto' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={onPick} />
            {latitude !== null && longitude !== null
                ? <Marker position={[latitude, longitude]} icon={pinIcon} />
                : null}
        </MapContainer>
    )
}

export default LocationPicker