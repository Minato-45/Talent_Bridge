const axios = require("axios");

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

async function testRegistration() {
  try {
    console.log("🧪 Testing Registration API\n");
    console.log("═".repeat(60));

    // Test 1: Job Seeker Registration
    console.log("\n📝 Test 1: Job Seeker Registration\n");

    const seekerData = {
      name: "Bhargav Sankar Alokam",
      email: "bhargav.alokam@test.com",
      password: "SecurePass@123",
      role: "jobseeker",
    };

    console.log("Sending:", seekerData);
    console.log("");

    try {
      const response = await API.post("/auth/register", seekerData);
      console.log("✅ SUCCESS");
      console.log("Status:", response.status);
      console.log("User:", response.data.user);
      console.log("Token:", response.data.token.substring(0, 50) + "...");
    } catch (error) {
      console.log("❌ FAILED");
      console.log("Status:", error.response?.status);
      console.log("Error:", error.response?.data);
    }

    // Test 2: Recruiter Registration (with company name)
    console.log("\n═".repeat(60));
    console.log("\n📝 Test 2: Recruiter Registration\n");

    const recruiterData = {
      name: "Jane Smith",
      email: "jane.smith@test.com",
      password: "SecurePass@123",
      role: "recruiter",
      companyName: "Tech Corp",
    };

    console.log("Sending:", recruiterData);
    console.log("");

    try {
      const response = await API.post("/auth/register", recruiterData);
      console.log("✅ SUCCESS");
      console.log("Status:", response.status);
      console.log("User:", response.data.user);
      console.log("Token:", response.data.token.substring(0, 50) + "...");
    } catch (error) {
      console.log("❌ FAILED");
      console.log("Status:", error.response?.status);
      console.log("Error:", error.response?.data);
    }

    // Test 3: Invalid email
    console.log("\n═".repeat(60));
    console.log("\n📝 Test 3: Invalid Email\n");

    const invalidEmailData = {
      name: "John Doe",
      email: "invalid-email",
      password: "SecurePass@123",
      role: "jobseeker",
    };

    console.log("Sending:", invalidEmailData);
    console.log("");

    try {
      const response = await API.post("/auth/register", invalidEmailData);
      console.log("✅ SUCCESS");
      console.log("Status:", response.status);
    } catch (error) {
      console.log("❌ EXPECTED FAILURE");
      console.log("Status:", error.response?.status);
      console.log("Error:", error.response?.data);
    }

    // Test 4: Weak password
    console.log("\n═".repeat(60));
    console.log("\n📝 Test 4: Weak Password\n");

    const weakPasswordData = {
      name: "John Doe",
      email: "john.doe@test.com",
      password: "weak", // No uppercase, lowercase, number, special char
      role: "jobseeker",
    };

    console.log("Sending:", weakPasswordData);
    console.log("");

    try {
      const response = await API.post("/auth/register", weakPasswordData);
      console.log("✅ SUCCESS");
      console.log("Status:", response.status);
    } catch (error) {
      console.log("❌ EXPECTED FAILURE");
      console.log("Status:", error.response?.status);
      console.log("Error:", error.response?.data);
    }

    console.log("\n═".repeat(60));
    console.log("\n✅ API Test Complete\n");
  } catch (error) {
    console.error("Testing error:", error.message);
  }
}

testRegistration();
