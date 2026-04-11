const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function cleanAndSetupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Cleaning entire database...\n');

    // Delete all collections
    await JobSeeker.deleteMany({});
    await Recruiter.deleteMany({});
    await JobSeekerProfile.deleteMany({});
    await EmployerProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    
    try {
      await User.deleteMany({});
    } catch (err) {
      // User collection might not exist
    }

    console.log('✅ Database cleaned - all collections cleared\n');
    console.log('═'.repeat(70));
    console.log('\n📝 Creating Fresh Test Accounts...\n');

    // Test Account 1: Job Seeker
    const seeker = await JobSeeker.create({
      name: 'John Doe',
      email: 'jobseeker@test.com',
      password: 'SecurePassword@123',
      role: 'jobseeker',
    });
    await JobSeekerProfile.create({ 
      userId: seeker._id,
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'Experienced full-stack developer',
      phone: '+1-234-567-8900'
    });
    console.log('✅ Job Seeker Account Created:');
    console.log('   Name: John Doe');
    console.log('   Email: jobseeker@test.com');
    console.log('   Password: SecurePassword@123');
    console.log('   Role: jobseeker\n');

    // Test Account 2: Recruiter
    const recruiter = await Recruiter.create({
      name: 'Jane Smith',
      email: 'recruiter@test.com',
      password: 'SecurePassword@123',
      role: 'recruiter',
    });
    await EmployerProfile.create({ 
      userId: recruiter._id,
      companyName: 'Tech Innovations Inc.',
      industry: 'Software Development',
      website: 'https://techinnovations.com',
      phone: '+1-555-123-4567'
    });
    console.log('✅ Recruiter Account Created:');
    console.log('   Name: Jane Smith');
    console.log('   Email: recruiter@test.com');
    console.log('   Password: SecurePassword@123');
    console.log('   Role: recruiter');
    console.log('   Company: Tech Innovations Inc.\n');

    // Test Account 3: Dual-Role (Same Email)
    const dualSeeker = await JobSeeker.create({
      name: 'Alex Johnson',
      email: 'alex@test.com',
      password: 'SecurePassword@123',
      role: 'jobseeker',
    });
    await JobSeekerProfile.create({ 
      userId: dualSeeker._id,
      skills: ['Python', 'Data Analysis', 'Machine Learning'],
      bio: 'Data scientist and recruiter',
      phone: '+1-678-901-2345'
    });

    const dualRecruiter = await Recruiter.create({
      name: 'Alex Johnson',
      email: 'alex@test.com',
      password: 'SecurePassword@123',
      role: 'recruiter',
    });
    await EmployerProfile.create({ 
      userId: dualRecruiter._id,
      companyName: 'DataDriven Solutions',
      industry: 'Data & Analytics',
      website: 'https://datadriven.com',
      phone: '+1-678-901-2345'
    });
    console.log('✅ Dual-Role Account Created (Same Email):');
    console.log('   Name: Alex Johnson');
    console.log('   Email: alex@test.com');
    console.log('   Password: SecurePassword@123');
    console.log('   Can login as: Both Job Seeker AND Recruiter\n');

    console.log('═'.repeat(70));
    console.log('\n🔍 Verifying Passwords...\n');

    // Verify all passwords work
    const testSeeker = await JobSeeker.findOne({ email: 'jobseeker@test.com' }).select('+password');
    const seekerMatch = await testSeeker.comparePassword('SecurePassword@123');
    console.log(`✅ Job Seeker (jobseeker@test.com): ${seekerMatch ? '✅ LOGIN WORKS' : '❌ LOGIN FAILS'}`);

    const testRecruiter = await Recruiter.findOne({ email: 'recruiter@test.com' }).select('+password');
    const recruiterMatch = await testRecruiter.comparePassword('SecurePassword@123');
    console.log(`✅ Recruiter (recruiter@test.com): ${recruiterMatch ? '✅ LOGIN WORKS' : '❌ LOGIN FAILS'}`);

    const testDualSeeker = await JobSeeker.findOne({ email: 'alex@test.com' }).select('+password');
    const dualSeekerMatch = await testDualSeeker.comparePassword('SecurePassword@123');
    console.log(`✅ Dual-Role Seeker (alex@test.com): ${dualSeekerMatch ? '✅ LOGIN WORKS' : '❌ LOGIN FAILS'}`);

    const testDualRecruiter = await Recruiter.findOne({ email: 'alex@test.com' }).select('+password');
    const dualRecruiterMatch = await testDualRecruiter.comparePassword('SecurePassword@123');
    console.log(`✅ Dual-Role Recruiter (alex@test.com): ${dualRecruiterMatch ? '✅ LOGIN WORKS' : '❌ LOGIN FAILS'}`);

    console.log('\n═'.repeat(70));
    console.log('\n📊 Database Summary:\n');
    console.log(`   Total Job Seekers: ${await JobSeeker.countDocuments()}`);
    console.log(`   Total Recruiters: ${await Recruiter.countDocuments()}`);
    console.log(`   Total Job Seeker Profiles: ${await JobSeekerProfile.countDocuments()}`);
    console.log(`   Total Employer Profiles: ${await EmployerProfile.countDocuments()}`);
    console.log(`   Total Jobs: ${await Job.countDocuments()}`);
    console.log(`   Total Applications: ${await Application.countDocuments()}`);
    console.log(`   Total Notifications: ${await Notification.countDocuments()}\n`);

    console.log('═'.repeat(70));
    console.log('\n✅ Database Setup Complete!\n');
    console.log('🔐 All accounts use password: SecurePassword@123\n');
    console.log('Ready to login! Open the app and try logging in.\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

cleanAndSetupDatabase();
