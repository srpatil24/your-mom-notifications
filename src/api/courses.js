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
    return Array.isArray(courses) ? courses : [courses];
}

async function getSubjectsMap() {
    const response = await fetch('https://public.enroll.wisc.edu/api/search/v1/subjectsMap/0000');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Step 2 & 3: Process Each Course Code
async function processCourses(courses) {
    const sampleEventsJson = [];
    const subjectsMap = await getSubjectsMap();
    // Create reverse mapping (subject name -> code)
    const reverseSubjectsMap = Object.entries(subjectsMap).reduce((acc, [code, name]) => {
        acc[name] = code;
        return acc;
    }, {});

    for (const course of courses) {
        const courseCode = course.sections?.[0]?.name || '';
        const subjectMatch = courseCode.match(/^([A-Z& ]+)\s*\d/);
        const extractedSubject = subjectMatch ? subjectMatch[1].trim() : null;

        if (extractedSubject) {
            sampleEventsJson.push({
                name: course.name || null,
                course_code: course.sections?.[0].name || null,
                sections: course.sections?.[1]?.name || null,
                subject_code: reverseSubjectsMap[extractedSubject]
            });
        }
    }

    return sampleEventsJson;
}

export { getCourses, processCourses };