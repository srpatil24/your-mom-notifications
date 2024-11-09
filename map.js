const API_KEY = 'AIzaSyASj1Vpv_8mBvDqc88Ez8Rhro-JnBObzHA';
const origin = '43.074302,-89.400024';
const destination = '43.075111,-89.4018738';
const base_url = 'https://maps.googleapis.com/maps/api/directions/json';

// Generate 3 different leave times, 30 minutes apart
const leave_times = Array.from({length: 3}, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + (30 * i));
    return date;
});

const routes = [];

const getRoutes = async () => {
    for (const leave_time of leave_times) {
        const params = new URLSearchParams({
            origin: origin,
            destination: destination,
            mode: 'walking',
            departure_time: Math.floor(leave_time.getTime() / 1000),
            key: API_KEY
        });

        try {
            const response = await fetch(`${base_url}?${params.toString()}`);
            const data = await response.json();

            if (data.status === 'OK') {
                for (const route of data.routes) {
                    const legs = route.legs[0];
                    routes.push({
                        departure_time: leave_time.toLocaleTimeString(),
                        arrival_time: new Date(leave_time.getTime() + (legs.duration.value * 1000)).toLocaleTimeString(),
                        duration: legs.duration.text,
                        summary: route.summary
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    }

    // Sort routes by duration
    const top_routes = routes
        .sort((a, b) => a.duration.localeCompare(b.duration))
        .slice(0, 3);

    // Display top three routes
    top_routes.forEach(route => {
        console.log(`Leave at: ${route.departure_time}, Arrive by: ${route.arrival_time}, Duration: ${route.duration}`);
    });
};

export { getRoutes };