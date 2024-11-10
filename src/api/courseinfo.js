// courseinfo.js
import { processClassMeetings, searchCourses } from './enrollmentPackages.js';

// Constants
const DEFAULT_TERM_CODE = '1252';

async function getCourseInfo(input) {
    const responseData = await searchCourses(DEFAULT_TERM_CODE, input.course_code);
    const data = await responseData.json();
    
    const matchingCourses = data.hits.filter(course =>
        input.course_code.includes(course.courseDesignation)
    );
    const course = matchingCourses;
    const course_id = course[0].courseId;
    course.classMeetings = await processClassMeetings(DEFAULT_TERM_CODE, input.subject_code, course_id);

    const formattedCourse = formatCourseInfo(course);
    return formattedCourse;
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

function formatCourseInfo(course) {
    const { courseDesignation, courseTitle, classMeetings } = course;

    // Initialize the course object
    const courseObj = {
        courseCode: courseDesignation || 'N/A',
        courseTitle: courseTitle || 'N/A',
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
                building: meeting.building?.buildingName || 'N/A',
                room: meeting.room || 'N/A'
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
