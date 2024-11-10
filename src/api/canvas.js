const CANVAS_API_TOKEN = '8396~WAGHVha388TGKAfJEJcrnG7rZwE6KufwFhtQtXTfTmJT8mycec878PtUkXZe3Dxh';
const CANVAS_API_BASE_URL = 'https://canvas.wisc.edu';

// Step 1: Fetch Todo Items
async function getTodoItems() {
    const response = await fetch(`${CANVAS_API_BASE_URL}/api/v1/users/self/todo`, {
        headers: {
            'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todoItems = await response.json();
    return todoItems;
}

// Step 2 & 3: Process Each Todo Item and Fetch Context Name
async function processTodoItems(todoItems) {
    const sampleEventsJson = [];

    for (const item of todoItems) {
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
        if (item.course_id) {
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