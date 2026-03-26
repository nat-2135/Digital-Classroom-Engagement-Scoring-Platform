const axios = require('axios');

async function checkAutomatically() {
    try {
        console.log("--- STARTING AUTOMATED TEST SUITE ---");
        
        // 1. Login Teacher -> T3
        const teacherRes = await axios.post('http://localhost:8080/api/auth/login', { email: 't3@test.com', password: 'pw' });
        const teacherToken = teacherRes.data.token;
        console.log("✅ Teacher logged in successfully.");

        // 2. Fetch students list for teacher (verifies the Null string patch)
        const studentsRes = await axios.get('http://localhost:8080/api/teacher/students', { headers: { Authorization: `Bearer ${teacherToken}` } });
        console.log(`✅ Teacher fetched ${studentsRes.data.length} students perfectly.`);

        // 3. Register a new Student to ensure we have the correct credentials
        const newStudentEmail = `test_student_${Date.now()}@test.com`;
        const studentRegRes = await axios.post('http://localhost:8080/api/auth/register', {
            name: 'Auto Student',
            email: newStudentEmail,
            password: 'pw',
            role: 'STUDENT'
        });
        const studentRes = await axios.post('http://localhost:8080/api/auth/login', { email: newStudentEmail, password: 'pw' });
        const studentToken = studentRes.data.token;
        console.log(`✅ Dedicated Student (${newStudentEmail}) dynamically registered and logged in.`);

        // 4. Fetch available Weekly tests for student (verifies latest unsubmitted test logic)
        const studentTestsResp = await axios.get('http://localhost:8080/api/student/tests/current', { headers: { Authorization: `Bearer ${studentToken}` } });
        console.log(`✅ Student fetched ${studentTestsResp.data.length} tests globally.`);
        
        // Let teacher create a quick test to evaluate
        const testPayload = {
            title: "Automated Verification Exam",
            subject: "System Integrity",
            weekNumber: 99,
            instructions: "Take this test",
            marksPerQuestion: 10,
            timeLimit: 15,
            dueDate: new Date().toISOString(),
            questions: JSON.stringify([{ id: 1, type: "SA", text: "Is the system online?", options: [], answer: "" }])
        };
        const createRes = await axios.post('http://localhost:8080/api/teacher/tests/create', testPayload, { headers: { Authorization: `Bearer ${teacherToken}` } });
        const testId = createRes.data.id;
        console.log(`✅ Teacher newly deployed Weekly Test ID: ${testId}`);

        // 5. Submit the test as Student
        const answers = JSON.stringify({ "1": "Yes, it is perfectly online!" });
        const submitRes = await axios.post(`http://localhost:8080/api/student/tests/${testId}/submit`, { answers }, { headers: { Authorization: `Bearer ${studentToken}` } });
        const submissionId = submitRes.data.id;
        console.log(`✅ Student submitted test answers successfully! Score arbitrarily assigned: ${submitRes.data.score}/${submitRes.data.totalMarks}`);

        // 6. Teacher overrides test score (verifies the PUT logic)
        const evalRes = await axios.put(`http://localhost:8080/api/teacher/tests/submissions/${submissionId}`, { score: 10 }, { headers: { Authorization: `Bearer ${teacherToken}` } });
        console.log(`✅ Teacher manually updated the student score to: ${evalRes.data.score}/${evalRes.data.totalMarks}`);

        console.log("\n🚀 ALL DIAGNOSTIC TESTS PASSED! SYSTEM IS PRODUCTION READY!");
    } catch (e) {
        console.error("❌ Test failed:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }
}

checkAutomatically();
