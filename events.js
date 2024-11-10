import ICAL from 'ical.js';  // Adjust the path as necessary

// URL of the ICS file
const url = 'https://today.wisc.edu/events.ics';

async function getEvents() {
    try {
        // Fetch the ICS data from the URL
        const response = await fetch(url);
        const icsData = await response.text();

        // Parse the ICS data
        const jcalData = ICAL.parse(icsData);  // Parse to jCal format
        const comp = new ICAL.Component(jcalData);
        const events = [];

        // Iterate over each VEVENT component and format event details
        comp.getAllSubcomponents('vevent').forEach(eventComp => {
            const event = new ICAL.Event(eventComp);
            events.push({
                title: event.summary,
                start: event.startDate.toString(),
                end: event.endDate.toString(),
                location: event.location || null,
                description: event.description || null
            });
        });

        return events;
    } catch (error) {
        console.error('Error fetching or parsing ICS file:', error);
        throw error;
    }
}

export { getEvents };
