const mongoose = require('mongoose');
require('dotenv').config();

const Recruiter = require('./models/Recruiter');

async function testRecruiterPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const recruiter = await Recruiter.findOne({ email: 'rambabu23524@gmail.com' }).select('+password');
    
    if (!recruiter) {
      console.log('❌ No recruiter found with email: rambabu23524@gmail.com\n');
      console.log('📋 Available Recruiters:');
      const allRecruiters = await Recruiter.find();
      allRecruiters.forEach((r, i) => {
        console.log(`  ${i+1}. ${r.name} (${r.email})`);
      });
    } else {
      console.log('✅ Found Recruiter:', recruiter.name);
      console.log('   Email:', recruiter.email);
      console.log('   Role:', recruiter.role);
      console.log('\n🔐 Testing password "password123":');
      
      const match = await recruiter.comparePassword('password123');
      console.log('   Match:', match);
      
      if (!match) {
        console.log('\n⚠️ Password "password123" does not match.\n');
        console.log('Try resetting the password by creating a new recruiter account.');
      } else {
        console.log('\n✅ Password matches! Login should work.');
      }
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testRecruiterPassword();
