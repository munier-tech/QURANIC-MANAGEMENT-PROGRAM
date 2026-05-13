import mongoose from 'mongoose';
import { connectDb } from './lib/connectdb.js';
import Salary from './models/salaryModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function markAllSalariesAsPaid() {
  try {
    // Connect to database
    await connectDb();

    // Update all unpaid salaries to be paid
    const result = await Salary.updateMany(
      { paid: false },
      {
        paid: true,
        paidDate: new Date()
      }
    );

    console.log(`${result.modifiedCount} salaries marked as paid`);
    console.log('Operation completed successfully');

    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating salaries:', error);
    process.exit(1);
  }
}

markAllSalariesAsPaid();