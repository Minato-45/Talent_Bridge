const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'rambabu23524@gmail.com';
    const newPassword = 'TestPassword123!';

    console.log('🔄 Resetting password for accounts...\n');

    // Reset Job Seeker password
    const seeker = await JobSeeker.findOne({ email });
    if (seeker) {
      seeker.password = newPassword;
      await seeker.save();
      console.log('✅ Job Seeker password reset:');
      console.log(`   Email: ${email}`);
      console.log(`   New Password: ${newPassword}`);
      console.log(`   Role: jobseeker\n`);
    } else {
      console.log('⚠️  Job Seeker account not found\n');
    }

    // Reset Recruiter password
    const recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      recruiter.password = newPassword;
      await recruiter.save();
      console.log('✅ Recruiter password reset:');
      console.log(`   Email: ${email}`);
      console.log(`   New Password: ${newPassword}`);
      console.log(`   Role: recruiter\n`);
    } else {
      console.log('⚠️  Recruiter account not found\n');
    }

    console.log('═'.repeat(60));
    console.log('\n🎯 TESTING LOGIN:\n');

    // Test logins
    if (seeker) {
      const testSeeker = await JobSeeker.findOne({ email }).select('+password');
      const seekerMatch = await testSeeker.comparePassword(newPassword);
      console.log(`✅ Job Seeker login test: ${seekerMatch ? '✅ WORKS' : '❌ FAILS'}`);
    }

    if (recruiter) {
      const testRecruiter = await Recruiter.findOne({ email }).select('+password');
      const recruiterMatch = await testRecruiter.comparePassword(newPassword);
      console.log(`✅ Recruiter login test: ${recruiterMatch ? '✅ WORKS' : '❌ FAILS'}`);
    }

    console.log('\n✅ Password reset completed!\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
