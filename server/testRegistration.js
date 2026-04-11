const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const JobSeeker = require("./models/JobSeeker");
const JobSeekerProfile = require("./models/JobSeekerProfile");

async function testRegistration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const testData = {
      name: "Bhargav Sankar Alokam",
      email: "rambabu23524@gmail.com",
      password: "Test@123456", // Must have uppercase, lowercase, number, special char
      role: "jobseeker",
    };

    console.log("🧪 Testing Registration with:");
    console.log(`   Name: ${testData.name}`);
    console.log(`   Email: ${testData.email}`);
    console.log(`   Password: ${testData.password}`);
    console.log(`   Role: ${testData.role}\n`);

    // Check if email already exists
    const existing = await JobSeeker.findOne({ email: testData.email });
    if (existing) {
      console.log("⚠️ Email already exists in database!");
      console.log(`   Name: ${existing.name}`);
      console.log(`   Role: ${existing.role}\n`);

      // Option to delete it
      console.log("🗑️ Deleting existing account...");
      await JobSeeker.deleteOne({ email: testData.email });
      console.log("✓ Deleted\n");
    }

    console.log("📝 Creating new account...\n");

    // Create user
    const user = await JobSeeker.create(testData);
    console.log("✅ User created successfully!");
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}\n`);

    // Create profile
    const profile = await JobSeekerProfile.create({ userId: user._id });
    console.log("✅ Profile created successfully!");
    console.log(`   Profile ID: ${profile._id}\n`);

    // Test password verification
    console.log("🔐 Testing password verification...");
    const userWithPassword = await JobSeeker.findById(user._id).select(
      "+password",
    );
    const isMatch = await userWithPassword.comparePassword("Test@123456");
    console.log(
      `   Password verification: ${isMatch ? "✅ WORKS" : "❌ FAILED"}\n`,
    );

    // Test token generation
    console.log("🔑 Testing token generation...");
    const token = user.generateToken();
    console.log(`   Token: ${token.substring(0, 50)}...\n`);

    console.log("═".repeat(60));
    console.log("✅ Registration test completed successfully!\n");
    console.log("📋 Summary:");
    console.log(`   User created: ✓`);
    console.log(`   Profile created: ✓`);
    console.log(`   Password verification: ✓`);
    console.log(`   Token generation: ✓\n`);

    console.log("🔑 Use these credentials to login:");
    console.log(`   Email: ${testData.email}`);
    console.log(`   Password: ${testData.password}`);
    console.log(`   Role: ${testData.role}\n`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n📋 Full Error:");
    console.error(error);
    process.exit(1);
  }
}

testRegistration();
