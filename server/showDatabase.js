const mongoose = require('mongoose');
require('dotenv').config();

const JobSeeker = require('./models/JobSeeker');
const Recruiter = require('./models/Recruiter');
const Job = require('./models/Job');
const Application = require('./models/Application');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const EmployerProfile = require('./models/EmployerProfile');
const Notification = require('./models/Notification');

async function showDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('═'.repeat(80));
    console.log('📊 COMPLETE DATABASE VIEW');
    console.log('═'.repeat(80));

    // Job Seekers
    const jobSeekers = await JobSeeker.find();
    console.log('\n👤 JOB SEEKERS:');
    console.log('─'.repeat(80));
    if (jobSeekers.length === 0) {
      console.log('  (No job seekers)');
    } else {
      jobSeekers.forEach((seeker) => {
        console.log(`\n  ID: ${seeker._id}`);
        console.log(`  Name: ${seeker.name}`);
        console.log(`  Email: ${seeker.email}`);
        console.log(`  Role: ${seeker.role}`);
        console.log(`  Registration Order: ${seeker.registrationOrder}`);
        console.log(`  Email Verified: ${seeker.isEmailVerified}`);
        console.log(`  Last Login: ${seeker.lastLogin || 'Never'}`);
        console.log(`  Created: ${new Date(seeker.createdAt).toLocaleString()}`);
      });
    }

    // Recruiters
    const recruiters = await Recruiter.find();
    console.log('\n\n🏢 RECRUITERS:');
    console.log('─'.repeat(80));
    if (recruiters.length === 0) {
      console.log('  (No recruiters)');
    } else {
      recruiters.forEach((recruiter) => {
        console.log(`\n  ID: ${recruiter._id}`);
        console.log(`  Name: ${recruiter.name}`);
        console.log(`  Email: ${recruiter.email}`);
        console.log(`  Role: ${recruiter.role}`);
        console.log(`  Registration Order: ${recruiter.registrationOrder}`);
        console.log(`  Email Verified: ${recruiter.isEmailVerified}`);
        console.log(`  Last Login: ${recruiter.lastLogin || 'Never'}`);
        console.log(`  Created: ${new Date(recruiter.createdAt).toLocaleString()}`);
      });
    }

    // Jobs
    const jobs = await Job.find().populate('employerId', 'name email');
    console.log('\n\n💼 JOBS:');
    console.log('─'.repeat(80));
    if (jobs.length === 0) {
      console.log('  (No jobs posted)');
    } else {
      jobs.forEach((job) => {
        console.log(`\n  ID: ${job._id}`);
        console.log(`  Title: ${job.title}`);
        console.log(`  Company: ${job.employerId?.name || 'N/A'}`);
        console.log(`  Location: ${job.location}`);
        console.log(`  Salary: ${job.salary ? `₹${job.salary.min}-${job.salary.max}` : 'Not specified'}`);
        console.log(`  Job Type: ${job.jobType || 'N/A'}`);
        console.log(`  Status: ${job.filled ? '✓ Filled' : '○ Open'}`);
        console.log(`  Applicants: ${job.applications?.length || 0}`);
        console.log(`  Posted: ${new Date(job.createdAt).toLocaleString()}`);
      });
    }

    // Applications
    const applications = await Application.find()
      .populate('jobSeekerId', 'name email')
      .populate('jobId', 'title')
      .populate('employerId', 'name email');
    console.log('\n\n📋 APPLICATIONS:');
    console.log('─'.repeat(80));
    if (applications.length === 0) {
      console.log('  (No applications)');
    } else {
      applications.forEach((app) => {
        console.log(`\n  ID: ${app._id}`);
        console.log(`  Job Seeker: ${app.jobSeekerId?.name || 'N/A'} (${app.jobSeekerId?.email || 'N/A'})`);
        console.log(`  Job: ${app.jobId?.title || 'N/A'}`);
        console.log(`  Employer: ${app.employerId?.name || 'N/A'} (${app.employerId?.email || 'N/A'})`);
        console.log(`  Status: ${app.status}`);
        console.log(`  Applied: ${new Date(app.createdAt).toLocaleString()}`);
      });
    }

    // Job Seeker Profiles
    const seekerProfiles = await JobSeekerProfile.find();
    console.log('\n\n👔 JOB SEEKER PROFILES:');
    console.log('─'.repeat(80));
    if (seekerProfiles.length === 0) {
      console.log('  (No profiles)');
    } else {
      seekerProfiles.forEach((profile) => {
        console.log(`\n  ID: ${profile._id}`);
        console.log(`  User ID: ${profile.userId}`);
        console.log(`  Skills: ${profile.skills?.length || 0} - ${(profile.skills || []).join(', ') || 'None'}`);
        console.log(`  Experience: ${profile.experience?.length || 0} entries`);
        console.log(`  Bio: ${profile.bio || 'Not specified'}`);
      });
    }

    // Employer Profiles
    const employerProfiles = await EmployerProfile.find();
    console.log('\n\n🏭 EMPLOYER PROFILES:');
    console.log('─'.repeat(80));
    if (employerProfiles.length === 0) {
      console.log('  (No profiles)');
    } else {
      employerProfiles.forEach((profile) => {
        console.log(`\n  ID: ${profile._id}`);
        console.log(`  User ID: ${profile.userId}`);
        console.log(`  Company: ${profile.companyName || 'Not specified'}`);
        console.log(`  Description: ${profile.companyDescription || 'Not specified'}`);
        console.log(`  Website: ${profile.website || 'Not specified'}`);
        console.log(`  Location: ${profile.location || 'Not specified'}`);
      });
    }

    // Notifications
    const notifications = await Notification.find();
    console.log('\n\n🔔 NOTIFICATIONS:');
    console.log('─'.repeat(80));
    if (notifications.length === 0) {
      console.log('  (No notifications)');
    } else {
      notifications.forEach((notif) => {
        console.log(`\n  ID: ${notif._id}`);
        console.log(`  User ID: ${notif.userId}`);
        console.log(`  Type: ${notif.type}`);
        console.log(`  Message: ${notif.message}`);
        console.log(`  Read: ${notif.read ? '✓ Yes' : '○ No'}`);
        console.log(`  Created: ${new Date(notif.createdAt).toLocaleString()}`);
      });
    }

    // Summary
    console.log('\n\n📈 DATABASE SUMMARY:');
    console.log('─'.repeat(80));
    console.log(`  Job Seekers: ${jobSeekers.length}`);
    console.log(`  Recruiters: ${recruiters.length}`);
    console.log(`  Jobs Posted: ${jobs.length}`);
    console.log(`  Applications: ${applications.length}`);
    console.log(`  Seeker Profiles: ${seekerProfiles.length}`);
    console.log(`  Employer Profiles: ${employerProfiles.length}`);
    console.log(`  Notifications: ${notifications.length}`);
    console.log('═'.repeat(80) + '\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

showDatabase();
