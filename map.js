const API_KEY = 'AIzaSyASj1Vpv_8mBvDqc88Ez8Rhro-JnBObzHA';
const origin = '43.074302,-89.400024';
const destination = '43.075111,-89.4018738';
const transportationMode = 'walking';
const base_url = 'https://maps.googleapis.com/maps/api/directions/json';

// Generate arrival time 5 minutes from now
const arrival_time = new Date();
arrival_time.setMinutes(arrival_time.getMinutes() + 5);

const routes = [];

const getRoutes = async () => {
    const params = new URLSearchParams({
        origin: origin,
        destination: destination,
        mode: transportationMode,
        arrival_time: Math.floor(arrival_time.getTime() / 1000),
        key: API_KEY
    });

    try {
        const response = await fetch(`${base_url}?${params.toString()}`);
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
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    }

    console.log(routes);
};

export { getRoutes };