const CANVAS_API_TOKEN = '8396~WAGHVha388TGKAfJEJcrnG7rZwE6KufwFhtQtXTfTmJT8mycec878PtUkXZe3Dxh';
const CANVAS_API_BASE_URL = 'https://canvas.wisc.edu';

// Step 1: Fetch Courses
async function getCourses() {
    const response = await fetch(`${CANVAS_API_BASE_URL}/api/v1/courses?enrollment_state=active&include[]=sections`, {
        headers: {
            'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const courses = await response.json();
    return courses;
}

// Step 2 & 3: Process Each Course Code
async function processCourses(courses) {
    const sampleEventsJson = [];

    for (const course of courses) {
        // Clean up course code by removing semester prefix and section suffix
        let cleanedCourseCode = course.course_code || '';
        cleanedCourseCode = cleanedCourseCode
            .replace(/^(FA|SP|SU)\d{2}\s+/, '');  // Remove semester prefix
        
        sampleEventsJson.push({
            name: course.name || null,
            course_code: cleanedCourseCode,
            sections: course.sections?.[1] || null
        });
    }

    return sampleEventsJson;
}

export { getCourses, processCourses };