const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');
const Job = require('./models/Job');
const Application = require('./models/Application');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function displayDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('📊 DATABASE: job_listing_portal\n');
    console.log('═'.repeat(80));
    
    // JobSeekers Collection
    const jobSeekers = await JobSeeker.find().lean();
    console.log(`\n📋 JOBSEEKERS Collection (${jobSeekers.length} records)`);
    console.log('─'.repeat(80));
    if (jobSeekers.length > 0) {
      console.log(JSON.stringify(jobSeekers.slice(0, 2), null, 2));
      if (jobSeekers.length > 2) console.log(`... and ${jobSeekers.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Recruiters Collection
    const recruiters = await Recruiter.find().lean();
    console.log(`\n\n👥 RECRUITERS Collection (${recruiters.length} records)`);
    console.log('─'.repeat(80));
    if (recruiters.length > 0) {
      console.log(JSON.stringify(recruiters.slice(0, 2), null, 2));
      if (recruiters.length > 2) console.log(`... and ${recruiters.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Jobs Collection
    const jobs = await Job.find().lean();
    console.log(`\n\n💼 JOBS Collection (${jobs.length} records)`);
    console.log('─'.repeat(80));
    if (jobs.length > 0) {
      console.log(JSON.stringify(jobs.slice(0, 2), null, 2));
      if (jobs.length > 2) console.log(`... and ${jobs.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Applications Collection
    const applications = await Application.find().lean();
    console.log(`\n\n📝 APPLICATIONS Collection (${applications.length} records)`);
    console.log('─'.repeat(80));
    if (applications.length > 0) {
      console.log(JSON.stringify(applications.slice(0, 2), null, 2));
      if (applications.length > 2) console.log(`... and ${applications.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Job Seeker Profiles
    const seekerProfiles = await JobSeekerProfile.find().lean();
    console.log(`\n\n👤 JOBSEEKERPROFILES Collection (${seekerProfiles.length} records)`);
    console.log('─'.repeat(80));
    if (seekerProfiles.length > 0) {
      console.log(JSON.stringify(seekerProfiles.slice(0, 2), null, 2));
      if (seekerProfiles.length > 2) console.log(`... and ${seekerProfiles.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Employer Profiles
    const employerProfiles = await EmployerProfile.find().lean();
    console.log(`\n\n🏢 EMPLOYERPROFILES Collection (${employerProfiles.length} records)`);
    console.log('─'.repeat(80));
    if (employerProfiles.length > 0) {
      console.log(JSON.stringify(employerProfiles.slice(0, 2), null, 2));
      if (employerProfiles.length > 2) console.log(`... and ${employerProfiles.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Notifications
    const notifications = await Notification.find().lean();
    console.log(`\n\n🔔 NOTIFICATIONS Collection (${notifications.length} records)`);
    console.log('─'.repeat(80));
    if (notifications.length > 0) {
      console.log(JSON.stringify(notifications.slice(0, 2), null, 2));
      if (notifications.length > 2) console.log(`... and ${notifications.length - 2} more`);
    } else {
      console.log('(Empty)');
    }
    
    // Summary
    console.log('\n\n' + '═'.repeat(80));
    console.log('\n📊 SUMMARY');
    console.log('─'.repeat(80));
    console.log(`Total Job Seekers:      ${jobSeekers.length}`);
    console.log(`Total Recruiters:       ${recruiters.length}`);
    console.log(`Total Jobs:             ${jobs.length}`);
    console.log(`Total Applications:     ${applications.length}`);
    console.log(`Total Seeker Profiles:  ${seekerProfiles.length}`);
    console.log(`Total Employer Profiles: ${employerProfiles.length}`);
    console.log(`Total Notifications:    ${notifications.length}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database view complete\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

displayDatabase();
