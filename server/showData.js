require('dotenv').config();
const mongoose = require('mongoose');

async function showData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    
    console.log('\n========== DATABASE CONTENTS ==========\n');
    console.log(`Connected to: ${process.env.MONGODB_URI}\n`);

    // Get Job Seekers
    const jobSeekers = db.collection('jobseekers');
    const jobSeekerCount = await jobSeekers.countDocuments();
    console.log(`\n📝 JOB SEEKERS (${jobSeekerCount} users) - First Come First Served Order`);
    console.log('─'.repeat(80));
    
    if (jobSeekerCount > 0) {
      const seekers = await jobSeekers.find({}).sort({ createdAt: 1 }).limit(10).toArray();
      seekers.forEach((seeker, index) => {
        console.log(`\n${index + 1}. ${seeker.name}`);
        console.log(`   Email: ${seeker.email}`);
        console.log(`   Registered: ${seeker.createdAt}`);
        console.log(`   Email Verified: ${seeker.isEmailVerified}`);
      });
      if (jobSeekerCount > 10) {
        console.log(`\n... and ${jobSeekerCount - 10} more job seekers`);
      }
    } else {
      console.log('(empty collection)');
    }

    // Get Recruiters
    const recruiters = db.collection('recruiters');
    const recruiterCount = await recruiters.countDocuments();
    console.log(`\n\n💼 RECRUITERS (${recruiterCount} users) - First Come First Served Order`);
    console.log('─'.repeat(80));
    
    if (recruiterCount > 0) {
      const recData = await recruiters.find({}).sort({ createdAt: 1 }).limit(10).toArray();
      recData.forEach((recruiter, index) => {
        console.log(`\n${index + 1}. ${recruiter.name}`);
        console.log(`   Email: ${recruiter.email}`);
        console.log(`   Registered: ${recruiter.createdAt}`);
        console.log(`   Email Verified: ${recruiter.isEmailVerified}`);
      });
      if (recruiterCount > 10) {
        console.log(`\n... and ${recruiterCount - 10} more recruiters`);
      }
    } else {
      console.log('(empty collection)');
    }

    // Get Jobs
    const jobs = db.collection('jobs');
    const jobCount = await jobs.countDocuments();
    console.log(`\n\n💼 JOBS (${jobCount} postings)`);
    console.log('─'.repeat(80));
    
    if (jobCount > 0) {
      const jobData = await jobs.find({}).limit(5).toArray();
      jobData.forEach((job, index) => {
        console.log(`\n${index + 1}. ${job.title}`);
        console.log(`   Posted by: ${job.employerId}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Salary: $${job.salaryMin} - $${job.salaryMax}`);
      });
      if (jobCount > 5) {
        console.log(`\n... and ${jobCount - 5} more jobs`);
      }
    } else {
      console.log('(empty collection)');
    }

    // Get Applications
    const applications = db.collection('applications');
    const appCount = await applications.countDocuments();
    console.log(`\n\n📄 APPLICATIONS (${appCount} total)`);
    console.log('─'.repeat(80));
    
    if (appCount > 0) {
      const appData = await applications.find({}).limit(5).toArray();
      appData.forEach((app, index) => {
        console.log(`\n${index + 1}. Job ID: ${app.jobId}`);
        console.log(`   Seeker: ${app.jobSeekerId}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Applied: ${app.createdAt}`);
      });
      if (appCount > 5) {
        console.log(`\n... and ${appCount - 5} more applications`);
      }
    } else {
      console.log('(empty collection)');
    }

    // Summary
    console.log(`\n\n📊 SUMMARY`);
    console.log('─'.repeat(80));
    console.log(`Total Users: ${jobSeekerCount + recruiterCount}`);
    console.log(`  ├─ Job Seekers: ${jobSeekerCount}`);
    console.log(`  └─ Recruiters: ${recruiterCount}`);
    console.log(`Total Jobs: ${jobCount}`);
    console.log(`Total Applications: ${appCount}`);

    await mongoose.connection.close();
    console.log('\n========== END OF DATA ==========\n');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

showData();
