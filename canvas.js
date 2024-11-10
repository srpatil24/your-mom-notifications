import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
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
        if (item.context_type === 'course' && item.course_id) {
            const courseResponse = await fetch(`${CANVAS_API_BASE_URL}/api/v1/courses/${item.course_id}`, {
                headers: {
                    'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            const course = await courseResponse.json();
            contextName = course.name;
        } else if (item.context_type === 'group' && item.group_id) {
            const groupResponse = await fetch(`${CANVAS_API_BASE_URL}/api/v1/groups/${item.group_id}`, {
                headers: {
                    'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            const group = await groupResponse.json();
            contextName = group.name;
        }

        sampleEventsJson.push({
            assignment: assignmentData,
            context_name: contextName
        });
    }

    return sampleEventsJson;
}

export { getTodoItems, processTodoItems };

(async () => {
    try {
        const todoItems = [
            {
                context_type: 'Course',
                course_id: 412449,
                context_name: 'COMPSCI354: Machine Organization and Programming (001) FA24',
                type: 'submitting',
                ignore: 'https://canvas.wisc.edu/api/v1/users/self/todo/assignment_2395155/submitting?permanent=0',
                ignore_permanently: 'https://canvas.wisc.edu/api/v1/users/self/todo/assignment_2395155/submitting?permanent=1',
                assignment: {
                    id: 2395155,
                    description: '<ul>...</ul>',
                    due_at: '2024-11-10T05:59:00Z',
                    name: 'A10',
                    // other assignment properties...
                },
                html_url: 'https://canvas.wisc.edu/courses/412449/assignments/2395155#submit'
            },
            // ... include more todo items as needed
        ];

        const processedItems = await processTodoItems(todoItems);
        console.log('Processed Items:', processedItems);
    } catch (error) {
        console.error('Error processing todo items:', error);
    }
})();
