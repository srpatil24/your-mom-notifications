import { processClassMeetings } from './enrollmentPackages.js';

// Constants
const BASE_API_URL = 'https://public.enroll.wisc.edu/api/search/v1';
const ENROLLMENT_PACKAGES_URL = `${BASE_API_URL}/enrollmentPackages`;
const DEFAULT_TERM_CODE = '1252';

// Search configuration
const DEFAULT_SEARCH_CONFIG = {
    page: 1,
    pageSize: 10,
    sortOrder: 'SCORE',
    filters: [{
        has_child: {
            type: 'enrollmentPackage',
            query: {
                bool: {
                    must: [
                        { match: { 'packageEnrollmentStatus.status': 'OPEN WAITLISTED CLOSED' } },
                        { match: { 'published': true } }
                    ]
                }
            }
        }
    }]
};

function normalizeCourseCode(input) {
    // Handle null/undefined
    if (!input) {
        throw new Error('Course code input is null or undefined');
    }

    // Extract the code string from various possible object formats
    const code = typeof input === 'object'
        ? (input.courseDesignation || input.course_code || input.name)
        : input;


    return code
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
}

async function fetchWithConfig(url, method = 'GET', body = null) {
    const config = {
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method,
        mode: 'cors'
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    // }

    return await response.json();
}

function formatTime(milliseconds) {
    const date = new Date(milliseconds);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${adjustedHours}:${formattedMinutes} ${ampm}`;
}

function formatDate(milliseconds) {
    const date = new Date(milliseconds);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

async function getCourseInfo(input) {
    const searchBody = {
        ...DEFAULT_SEARCH_CONFIG,
        selectedTerm: DEFAULT_TERM_CODE,
        queryString: typeof input === 'object' 
            ? (input.courseDesignation || input.course_code || input.name)
            : input,
    };

    const responseData = await fetchWithConfig(
        BASE_API_URL,
        'POST',
        searchBody
    );

    const normalizedInputCode = normalizeCourseCode(input);
    const matchingCourses = responseData.hits.filter(course =>
        course.courseDesignation &&
        normalizeCourseCode(course.courseDesignation) === normalizedInputCode
    );

    const course = matchingCourses[0];
    course.classMeetings = await processClassMeetings(DEFAULT_TERM_CODE, course);

    const formattedCourse = formatCourseInfo(course);
    return formattedCourse;
}

function formatCourseInfo(course) {
    const { courseDesignation, courseTitle, classMeetings } = course;

    // Initialize the course object
    const courseObj = {
        courseCode: courseDesignation,
        courseTitle: courseTitle,
        weeklyMeetings: [],
        exams: []
    };

    // Iterate through class meetings and categorize them
    classMeetings.forEach(meeting => {
        if (meeting.meetingType === 'CLASS') {
            courseObj.weeklyMeetings.push({
                type: meeting.meetingOrExamNumber, // Adjust if there's a better field
                days: meeting.meetingDays,
                startTime: formatTime(meeting.meetingTimeStart),
                endTime: formatTime(meeting.meetingTimeEnd),
                building: meeting.building.buildingName,
                room: meeting.room
            });
        } else if (meeting.meetingType === 'EXAM') {
            courseObj.exams.push({
                date: formatDate(meeting.examDate),
                startTime: formatTime(meeting.meetingTimeStart),
                endTime: formatTime(meeting.meetingTimeEnd)
            });
        }
    });

    return courseObj;
}

export { getCourseInfo };

