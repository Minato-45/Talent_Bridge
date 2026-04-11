const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');
const Job = require('./models/Job');
const Application = require('./models/Application');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');
const Notification = require('./models/Notification');

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('🗑️  Cleaning database...\n');
    
    const collections = [
      { name: 'JobSeekers', model: JobSeeker },
      { name: 'Recruiters', model: Recruiter },
      { name: 'Jobs', model: Job },
      { name: 'Applications', model: Application },
      { name: 'JobSeekerProfiles', model: JobSeekerProfile },
      { name: 'EmployerProfiles', model: EmployerProfile },
      { name: 'Notifications', model: Notification },
    ];
    
    for (const collection of collections) {
      const count = await collection.model.deleteMany({});
      console.log(`  ✓ Deleted all ${collection.name} (${count.deletedCount} records)`);
    }
    
    console.log('\n✅ Database cleaned successfully!');
    console.log('\n📝 Rules for new data:');
    console.log('  • JobSeekers: Numbered 1, 2, 3... in order of registration');
    console.log('  • Recruiters: Numbered 1, 2, 3... in order of registration (separately)');
    console.log('  • Stored completely separately by role\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
