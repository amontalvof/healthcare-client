import { HospitalAddress } from '@/types/Doctor';

export async function geocodeAddress({
    street,
    city,
    state,
    postalCode,
    country,
}: HospitalAddress): Promise<{ lat: number; lon: number } | null> {
    const query = encodeURIComponent(
        `${street}, ${city}, ${state} ${postalCode}, ${country}`
    );
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'your-app-name (practice-project)' },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
}
