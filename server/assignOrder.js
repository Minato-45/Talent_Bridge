const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');

async function assignRegistrationOrder() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // JobSeekers - assign order 1, 2, 3...
    const jobSeekers = await JobSeeker.find().sort({ createdAt: 1 }).lean();
    console.log(`📋 Assigning JobSeeker registration order (${jobSeekers.length} records)...`);
    for (let i = 0; i < jobSeekers.length; i++) {
      await JobSeeker.findByIdAndUpdate(
        jobSeekers[i]._id,
        { registrationOrder: i + 1 }
      );
      console.log(`  ✓ ${jobSeekers[i].name} → Order: ${i + 1}`);
    }
    
    // Recruiters - assign order 1, 2, 3...
    const recruiters = await Recruiter.find().sort({ createdAt: 1 }).lean();
    console.log(`\n👥 Assigning Recruiter registration order (${recruiters.length} records)...`);
    for (let i = 0; i < recruiters.length; i++) {
      await Recruiter.findByIdAndUpdate(
        recruiters[i]._id,
        { registrationOrder: i + 1 }
      );
      console.log(`  ✓ ${recruiters[i].name} → Order: ${i + 1}`);
    }
    
    console.log('\n✅ Registration order assigned successfully!');
    
    // Show updated data
    console.log('\n📊 UPDATED DATA:\n');
    const updatedSeekers = await JobSeeker.find().sort({ registrationOrder: 1 });
    console.log('JobSeekers:');
    updatedSeekers.forEach(s => {
      console.log(`  ${s.registrationOrder}. ${s.name} (${s.email})`);
    });
    
    console.log('\nRecruiters:');
    const updatedRecruiters = await Recruiter.find().sort({ registrationOrder: 1 });
    updatedRecruiters.forEach(r => {
      console.log(`  ${r.registrationOrder}. ${r.name} (${r.email})`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

assignRegistrationOrder();
