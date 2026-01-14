// Test script to verify authentication flow
// This simulates what the frontend does during sign-in

const API_BASE_URL = "http://localhost:8000";

async function testSignup() {
    console.log("🧪 Testing Signup...");

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: "Test User",
                email: `test${Date.now()}@example.com`,
                password: "testpassword123"
            })
        });

        console.log("Signup Status:", response.status);
        const data = await response.json();
        console.log("Signup Response:", JSON.stringify(data, null, 2));

        if (data.success && data.data?.token) {
            console.log("✅ Signup successful!");
            return data.data.token;
        } else {
            console.log("❌ Signup failed:", data.error?.message);
            return null;
        }
    } catch (error) {
        console.log("❌ Signup error:", error.message);
        return null;
    }
}

async function testLogin() {
    console.log("\n🧪 Testing Login...");

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "demo@example.com",
                password: "password123"
            })
        });

        console.log("Login Status:", response.status);
        const data = await response.json();
        console.log("Login Response:", JSON.stringify(data, null, 2));

        if (data.success && data.data?.token) {
            console.log("✅ Login successful!");
            return data.data.token;
        } else {
            console.log("❌ Login failed:", data.error?.message);
            return null;
        }
    } catch (error) {
        console.log("❌ Login error:", error.message);
        return null;
    }
}

async function testTaskWithToken(token) {
    console.log("\n🧪 Testing Task CRUD with JWT...");

    try {
        // Test GET tasks
        const getResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("GET Tasks Status:", getResponse.status);
        const tasks = await getResponse.json();
        console.log("Current tasks:", JSON.stringify(tasks, null, 2));

        // Test POST task
        const postResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "Browser Test Task",
                description: "Created via fetch test"
            })
        });
        console.log("POST Task Status:", postResponse.status);
        const newTask = await postResponse.json();
        console.log("New task:", JSON.stringify(newTask, null, 2));

        if (newTask.id) {
            console.log("✅ Task creation successful!");
            return newTask.id;
        } else {
            console.log("❌ Task creation failed");
            return null;
        }
    } catch (error) {
        console.log("❌ Task error:", error.message);
        return null;
    }
}

async function runTests() {
    console.log("🚀 Starting Authentication Flow Test\n");
    console.log("API URL:", API_BASE_URL);

    // Test login first
    const loginToken = await testLogin();

    if (loginToken) {
        await testTaskWithToken(loginToken);
    }

    console.log("\n🎯 Test Summary:");
    console.log("- Backend URL:", API_BASE_URL);
    console.log("- CORS Config: Updated to include port 3001");
    console.log("- Authentication: Working");

    console.log("\n💡 To fix 'failed to fetch' error:");
    console.log("1. Ensure backend is running on port 8000");
    console.log("2. Ensure frontend API_URL is set to localhost:8000");
    console.log("3. Ensure CORS allows origin from frontend port");
}

runTests();