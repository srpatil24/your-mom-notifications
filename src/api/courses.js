import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_API_BASE_URL = 'https://canvas.wisc.edu';

// Step 1: Fetch Courses
async function getCourses() {
    const response = await fetch(`${CANVAS_API_BASE_URL}/api/v1/courses`, {
        headers: {
            'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const courses = await response.json();
    return courses;
}

// Step 2 & 3: Process Each Todo Item and Fetch Context Name
async function processCourses(courses) {
    const sampleEventsJson = [];

    for (const item of courses) {
        let assignmentData = {};
        let contextName = '';

        // Extract assignment or quiz details
        assignmentData = {
            name: item.assignment.name || null,
            due_at: item.assignment.due_at || null,
            description: item.assignment.description || null,
            is_quiz_assignment: item.assignment.is_quiz_assignment,
            html_url: item.assignment.html_url || null
        };

        // Fetch context name based on context_type
        if (item.context_type === 'course' && item.course_id) {
            const courseResponse = await fetch(`${CANVAS_API_BASE_URL}/api/v1/courses/${item.course_id}`, {
                headers: {
                    'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            const course = await courseResponse.json();
            contextName = course.name;
        }
        
        sampleEventsJson.push({
            assignment: assignmentData,
            context_name: contextName
        });
    }

    return sampleEventsJson;
}

export { getTodoItems, processTodoItems };