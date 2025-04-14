"use client"

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface MiniMapProps {
    lat: number
    lon: number
    zoom?: number
    className?: string
}

export default function MiniMap({ lat, lon, zoom = 17, className }: MiniMapProps) {
    const icon = L.icon({ iconUrl: "/marker-icon.png" });

    return (
        <MapContainer
            center={[lat, lon]}
            zoom={zoom}
            className={className || "h-full w-full"}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            zoomControl={false}
            attributionControl={false}
            style={{ zIndex: 1 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
            />
            <Marker position={[lat, lon]} icon={icon} />
        </MapContainer>
    )
}
