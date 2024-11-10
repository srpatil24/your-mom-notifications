// import ical from 'node-ical';

// URL of the ICS file
const url = 'https://today.wisc.edu/events.ics';

async function getEvents() {
    try {
        // Fetch the ICS data from the URL
        const response = await fetch(url);
        const icsData = await response.text();

        // Parse the ICS data
        const data = ical.parseICS(icsData);

        // Array to store formatted events
        const events = [];

        // Iterate over the events and format details
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                let event = data[k];
                if (event.type === 'VEVENT') {
                    events.push({
                        title: event.summary,
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                        location: event.location || null,
                        description: event.description || null
                    });
                }
            }
        }
        return events;
    } catch (error) {
        console.error('Error fetching or parsing ICS file:', error);
        throw error;
    }
}

export { getEvents };