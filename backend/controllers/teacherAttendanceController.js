import prisma from '../lib/prismaClient.js';


export const recordAttendance = async (req, res) => {
  try {
    const { teacherId, date, status, checkIn, checkOut, notes } = req.body;

    // Validate required fields
    if (!teacherId || !status) {
      return res.status(400).json({ message: 'Teacher ID and status are required' });
    }

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check for existing attendance record for same date
    const existingAttendance = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId,
        date: date ? new Date(date) : new Date()
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already recorded for this date' });
    }

    const attendance = await prisma.teacherAttendance.create({
      data: {
        teacherId,
        date: date ? new Date(date) : new Date(),
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        notes,
        recordedById: req.user.id
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        recordedBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: attendance,
      date: attendance.date.toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { from, to, teacherId } = req.query;
    const where = {};

    // Date range filter
    if (from && to) {
      where.date = {
        gte: new Date(from),
        lte: new Date(to)
      };
    }

    // Filter by specific teacher
    if (teacherId) {
      where.teacherId = teacherId;
    }

    const attendance = await prisma.teacherAttendance.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            number: true
          }
        },
        recordedBy: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getTeachersAttendanceByDate = async (req, res) => {
  try {
    const { date, teacherId } = req.query;
    const where = {};

    // Validate date parameter
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required (YYYY-MM-DD format)'
      });
    }

    // Create date range for the entire day
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Next day at 00:00:00

    where.date = {
      gte: startDate,
      lt: endDate
    };

    // Filter by specific teacher if provided
    if (teacherId) {
      where.teacherId = teacherId;
    }

    const attendance = await prisma.teacherAttendance.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            number: true
          }
        },
        recordedBy: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.status(200).json({
      success: true,
      date: date,
      count: attendance.length,
      data: attendance
    });

  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance records'
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { status, checkIn, checkOut, notes } = req.body;
    const attendanceId = req.params.id;

    const attendance = await prisma.teacherAttendance.findUnique({
      where: { id: attendanceId }
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Prepare update data
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (checkIn !== undefined) updateData.checkIn = checkIn ? new Date(checkIn) : null;
    if (checkOut !== undefined) updateData.checkOut = checkOut ? new Date(checkOut) : null;
    if (notes !== undefined) updateData.notes = notes;

    const updatedAttendance = await prisma.teacherAttendance.update({
      where: { id: attendanceId },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: updatedAttendance
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await prisma.teacherAttendance.findUnique({
      where: { id: req.params.id }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await prisma.teacherAttendance.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};