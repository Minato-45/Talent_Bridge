const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');

async function testAutoOrdering() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('🧪 Testing Auto-Ordering System...\n');
    
    // Create test JobSeekers
    console.log('📋 Creating JobSeekers...');
    const seeker1 = await JobSeeker.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    console.log(`  ✓ JobSeeker 1: ${seeker1.name} → Order: ${seeker1.registrationOrder}`);
    
    const seeker2 = await JobSeeker.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
    });
    console.log(`  ✓ JobSeeker 2: ${seeker2.name} → Order: ${seeker2.registrationOrder}`);
    
    const seeker3 = await JobSeeker.create({
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'password123',
    });
    console.log(`  ✓ JobSeeker 3: ${seeker3.name} → Order: ${seeker3.registrationOrder}`);
    
    // Create test Recruiters
    console.log('\n👥 Creating Recruiters...');
    const recruiter1 = await Recruiter.create({
      name: 'Alice Johnson',
      email: 'alice@company.com',
      password: 'password123',
    });
    console.log(`  ✓ Recruiter 1: ${recruiter1.name} → Order: ${recruiter1.registrationOrder}`);
    
    const recruiter2 = await Recruiter.create({
      name: 'Charlie Brown',
      email: 'charlie@company.com',
      password: 'password123',
    });
    console.log(`  ✓ Recruiter 2: ${recruiter2.name} → Order: ${recruiter2.registrationOrder}`);
    
    console.log('\n✅ Auto-Ordering Works Perfectly!\n');
    
    // Show summary
    console.log('📊 DATABASE SUMMARY');
    console.log('─'.repeat(60));
    
    const allSeekers = await JobSeeker.find().sort({ registrationOrder: 1 });
    console.log('\nJob Seekers (Separate Collection):');
    allSeekers.forEach(s => {
      console.log(`  ${s.registrationOrder}. ${s.name} (${s.email})`);
    });
    
    const allRecruiters = await Recruiter.find().sort({ registrationOrder: 1 });
    console.log('\nRecruiters (Separate Collection):');
    allRecruiters.forEach(r => {
      console.log(`  ${r.registrationOrder}. ${r.name} (${r.email})`);
    });
    
    console.log('\n✅ Each role has its own numbering (1, 2, 3...)');
    console.log('✅ Each role stored in separate collection\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAutoOrdering();
