const BASE_API_URL = 'https://public.enroll.wisc.edu/api/search/v1';
const ENROLLMENT_PACKAGES_URL = `${BASE_API_URL}/enrollmentPackages`;

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
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function getEnrollmentPackages(termCode, subjectCode, courseId) {
    const url = `${ENROLLMENT_PACKAGES_URL}/${termCode}/${subjectCode}/${courseId}`;
    return await fetchWithConfig(url);
}

export async function processClassMeetings(course) {
    const { termCode, subject: { subjectCode }, courseId } = course;
    const enrollmentPackages = await getEnrollmentPackages(termCode, subjectCode, courseId);
    return enrollmentPackages.flatMap(pkg => pkg.classMeetings || []);
} 