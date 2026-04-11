const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');

async function createTestAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('🗑️  Cleaning old test accounts...');
    await JobSeeker.deleteMany({ email: { $in: ['seeker@test.com', 'recruiter@test.com'] } });
    await Recruiter.deleteMany({ email: { $in: ['seeker@test.com', 'recruiter@test.com'] } });
    await JobSeekerProfile.deleteMany({});
    await EmployerProfile.deleteMany({});
    
    console.log('✅ Old accounts cleaned\n');
    
    console.log('📝 Creating Test Accounts...\n');
    
    // Create Job Seeker
    const seeker = await JobSeeker.create({
      name: 'Test Job Seeker',
      email: 'seeker@test.com',
      password: 'TestPassword123!',
      role: 'jobseeker',
    });
    await JobSeekerProfile.create({ userId: seeker._id });
    console.log('✅ Job Seeker Account Created:');
    console.log('   Email: seeker@test.com');
    console.log('   Password: TestPassword123!');
    console.log('   Role: jobseeker\n');
    
    // Create Recruiter
    const recruiter = await Recruiter.create({
      name: 'Test Recruiter',
      email: 'recruiter@test.com',
      password: 'TestPassword123!',
      role: 'recruiter',
    });
    await EmployerProfile.create({ 
      userId: recruiter._id,
      companyName: 'Test Company'
    });
    console.log('✅ Recruiter Account Created:');
    console.log('   Email: recruiter@test.com');
    console.log('   Password: TestPassword123!');
    console.log('   Role: recruiter\n');
    
    console.log('═'.repeat(60));
    console.log('\n📋 SAME EMAIL TEST:');
    console.log('━'.repeat(60));
    
    // Create same email for both roles
    const sameEmailSeeker = await JobSeeker.create({
      name: 'Same Email User - Seeker',
      email: 'sameemail@test.com',
      password: 'SamePassword123!',
      role: 'jobseeker',
    });
    await JobSeekerProfile.create({ userId: sameEmailSeeker._id });
    
    const sameEmailRecruiter = await Recruiter.create({
      name: 'Same Email User - Recruiter',
      email: 'sameemail@test.com',
      password: 'SamePassword123!',
      role: 'recruiter',
    });
    await EmployerProfile.create({ 
      userId: sameEmailRecruiter._id,
      companyName: 'Same Email Test Company'
    });
    
    console.log('✅ Dual-Role Account Created (Same Email):');
    console.log('   Email: sameemail@test.com');
    console.log('   Password: SamePassword123!');
    console.log('   Can login as: Both Job Seeker AND Recruiter\n');
    
    console.log('═'.repeat(60));
    console.log('\n🎯 TESTING LOGIN:\n');
    
    // Test logins
    const testSeeker = await JobSeeker.findOne({ email: 'seeker@test.com' }).select('+password');
    const seekerMatch = await testSeeker.comparePassword('TestPassword123!');
    console.log(`✅ Job Seeker login test: ${seekerMatch ? '✅ WORKS' : '❌ FAILS'}`);
    
    const testRecruiter = await Recruiter.findOne({ email: 'recruiter@test.com' }).select('+password');
    const recruiterMatch = await testRecruiter.comparePassword('TestPassword123!');
    console.log(`✅ Recruiter login test: ${recruiterMatch ? '✅ WORKS' : '❌ FAILS'}`);
    
    const testSameEmail = await JobSeeker.findOne({ email: 'sameemail@test.com' }).select('+password');
    const sameEmailMatch = await testSameEmail.comparePassword('SamePassword123!');
    console.log(`✅ Same Email (Seeker) login test: ${sameEmailMatch ? '✅ WORKS' : '❌ FAILS'}`);
    
    const testSameEmailRec = await Recruiter.findOne({ email: 'sameemail@test.com' }).select('+password');
    const sameEmailRecMatch = await testSameEmailRec.comparePassword('SamePassword123!');
    console.log(`✅ Same Email (Recruiter) login test: ${sameEmailRecMatch ? '✅ WORKS' : '❌ FAILS'}`);
    
    console.log('\n✅ All test accounts created successfully!\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestAccounts();
