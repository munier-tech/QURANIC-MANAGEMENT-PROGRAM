import mongoose from 'mongoose';
import { connectDb } from './lib/connectdb.js';
import Class from './models/classModel.js';
import Student from './models/studentsModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkData() {
  try {
    // Connect to database
    await connectDb();

    // Count classes
    const classCount = await Class.countDocuments();
    console.log(`Total classes: ${classCount}`);

    // Count students
    const studentCount = await Student.countDocuments();
    console.log(`Total students: ${studentCount}`);

    // Get classes
    const classes = await Class.find().select('name level').limit(5);
    console.log('Classes:');
    classes.forEach((cls, index) => {
      console.log(`${index + 1}. ${cls.name} - ${cls.level || 'No level'}`);
    });

    // Get students
    const students = await Student.find().populate('classId', 'name').select('fullname studentId classId').limit(5);
    console.log('Students:');
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullname} (${student.studentId}) - Class: ${student.classId?.name || 'No class'}`);
    });

    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
}

checkData();