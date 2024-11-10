// Function to fetch course information from UW-Madison enrollment system
async function getCourseInfo(courseCode) {
    try {
        const response = await fetch("https://public.enroll.wisc.edu/api/search/v1", {
            "credentials": "include",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "method": "POST",
            "body": JSON.stringify({
                "selectedTerm": "1252",
                "queryString": courseCode,
                "filters": [{
                    "has_child": {
                        "type": "enrollmentPackage",
                        "query": {
                            "bool": {
                                "must": [
                                    { "match": { "packageEnrollmentStatus.status": "OPEN WAITLISTED CLOSED" } },
                                    { "match": { "published": true } }
                                ]
                            }
                        }
                    }
                }],
                "page": 1,
                "pageSize": 10,
                "sortOrder": "SCORE"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        // Check if responseData and responseData.data exist
        if (!responseData || !responseData.data) {
            console.error('Invalid response structure:', responseData);
            return null;
        }

        const normalizedInputCode = courseCode.replace(/\s+/g, '').toUpperCase();
        const matchingCourses = responseData.data.filter(course => {
            const normalizedCourseCode = course.courseDesignation.replace(/\s+/g, '').toUpperCase();
            return normalizedCourseCode === normalizedInputCode;
        });

        // Return the entire course object if found, otherwise null
        return matchingCourses || null;

    } catch (error) {
        console.error('Error fetching course information:', error);
        throw error;
    }
}
export { getCourseInfo };