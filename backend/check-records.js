import mongoose from 'mongoose';
import { connectDb } from './lib/connectdb.js';
import DailyQuran from './models/dailyQuranModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkDailyQuranRecords() {
  try {
    // Connect to database
    await connectDb();

    // Count all daily Quran records
    const totalRecords = await DailyQuran.countDocuments();
    console.log(`Total daily Quran records: ${totalRecords}`);

    // Get recent records (last 10)
    const recentRecords = await DailyQuran.find()
      .populate('student', 'fullname studentId')
      .populate('class', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    console.log('Recent records:');
    recentRecords.forEach((record, index) => {
      console.log(`${index + 1}. Student: ${record.student?.fullname || 'Unknown'} (${record.student?.studentId || 'N/A'})`);
      console.log(`   Class: ${record.class?.name || 'Unknown'}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Date: ${record.date}`);
      console.log(`   Created: ${record.createdAt}`);
      console.log('---');
    });

    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking records:', error);
    process.exit(1);
  }
}

checkDailyQuranRecords();