// enrollmentPackages.js
const BASE_API_URL = 'https://public.enroll.wisc.edu';
const ENROLLMENT_PACKAGES_URL = `${BASE_API_URL}/api/search/v1/enrollmentPackages`;
const SEARCH_URL = `${BASE_API_URL}/api/search/v1`;

// Search configuration
const SEARCH_CONFIG = {
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

// Fetch configuration with additional headers
async function fetchWithConfig(url, body = null, method = 'POST') {
    const config = {
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Accept-Language': 'en-US,en;q=0.5',
            'Sec-GPC': '1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Priority': 'u=0'
        },
        method: method,
        body: body ? JSON.stringify(body) : null,
        mode: 'cors'
    };

    return await fetch(url, config);
}

export async function searchCourses(term, keywords) {
    const url = new URL(SEARCH_URL);
    const searchBody = { ...SEARCH_CONFIG };
    searchBody.selectedTerm = term;
    searchBody.queryString = keywords || "";

    return await fetchWithConfig(url, searchBody);
}

export async function processClassMeetings(termCode, subjectCode, courseId) {
    const url = `${ENROLLMENT_PACKAGES_URL}/${termCode}/${subjectCode}/${courseId}`;
    const response = await fetchWithConfig(url, null, 'GET');
    const data = await response.json();
    return data.flatMap(pkg => pkg.classMeetings || []);
}
