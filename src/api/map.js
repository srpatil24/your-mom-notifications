const API_KEY = 'AIzaSyASj1Vpv_8mBvDqc88Ez8Rhro-JnBObzHA'
const MAP_API_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

async function getRoutes(originLatitude, originLongitude, destinationLatitude, destinationLongitude, transportationMode = 'walking') {
    // Format the origin and destination coordinates
    const origin = `${originLatitude},${originLongitude}`;
    const destination = `${destinationLatitude},${destinationLongitude}`;

    // Generate arrival time 5 minutes from now
    const arrival_time = new Date();
    arrival_time.setMinutes(arrival_time.getMinutes() + 5);

    const routes = [];

    const params = new URLSearchParams({
        origin: origin,
        destination: destination,
        mode: transportationMode,
        arrival_time: Math.floor(arrival_time.getTime() / 1000),
        key: API_KEY
    });

    try {
        const response = await fetch(`${MAP_API_BASE_URL}?${params.toString()}`);
        const data = await response.json();

        if (data.status === 'OK') {
            for (const route of data.routes) {
                const legs = route.legs[0];
                routes.push({
                    departure_time: new Date(arrival_time.getTime() - (legs.duration.value * 1000)).toISOString(),
                    arrival_time: arrival_time.toISOString(),
                    duration: legs.duration.text,
                    summary: route.summary
                });
            }
        } else {
            console.error('Error in response:', data.status);
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        throw error; // Re-throw the error for handling in the calling function
    }

    console.log(routes);
    return routes;
}

export { getRoutes };