import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { geocodeAddress } from '@/helpers/geocode';
import { HospitalAddress } from '@/types/Doctor';
import { formatAddress } from '@/helpers/formatAddress';
import { useQueries } from '@tanstack/react-query';

type Props = { hospitalsNames: string[]; hospitals: HospitalAddress[] };

export const HospitalMap: React.FC<Props> = ({ hospitals, hospitalsNames }) => {
    const geocodeQueries = useQueries({
        queries: hospitals.map((h) => ({
            queryKey: [
                'geocode',
                h.street,
                h.city,
                h.state,
                h.postalCode,
                h.country,
            ],
            queryFn: () => geocodeAddress(h),
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 3,
        })),
    });

    if (geocodeQueries.some((q) => q.isLoading)) {
        return <div>Loading map…</div>;
    }

    const markers = geocodeQueries
        .map((q, i) => {
            const name = hospitalsNames[i] || '';
            if (q.data) {
                return {
                    name,
                    hospital: hospitals[i],
                    lat: q.data.lat,
                    lon: q.data.lon,
                };
            }
            return null;
        })
        .filter(
            (
                m
            ): m is {
                hospital: HospitalAddress;
                name: string;
                lat: number;
                lon: number;
            } => Boolean(m)
        );

    // If nothing geocoded successfully:
    if (markers.length === 0) {
        return <div>No locations found.</div>;
    }

    const center: [number, number] = [markers[0].lat, markers[0].lon];

    return (
        <MapContainer
            className="z-0"
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map(({ hospital, name, lat, lon }) => (
                <Marker key={hospital.id} position={[lat, lon]}>
                    <Popup>
                        <strong>{name}</strong>
                        <br />
                        {formatAddress(hospital)}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
