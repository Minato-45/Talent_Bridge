const mongoose = require('mongoose');

async function showDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/job_listing_portal');
    
    const db = mongoose.connection.db;
    
    console.log('\n========================================');
    console.log('  DATABASE CONTENTS');
    console.log('========================================\n');
    
    const collections = [
      'users', 'jobseekers', 'recruiters', 'jobs', 
      'applications', 'jobseekerprofiles', 'employerprofiles', 'notifications'
    ];
    
    for (const collName of collections) {
      const count = await db.collection(collName).countDocuments();
      console.log(`[${collName.toUpperCase()}] - ${count} document(s)`);
      
      if (count > 0) {
        const docs = await db.collection(collName).find().limit(2).toArray();
        docs.forEach((doc, idx) => {
          console.log(`  Record ${idx + 1}:`);
          console.log('    ' + JSON.stringify(doc, null, 2).split('\n').slice(0, 6).join('\n    '));
        });
      }
      console.log('');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

showDatabase();
