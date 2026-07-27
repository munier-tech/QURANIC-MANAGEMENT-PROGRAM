import prisma from "../lib/prismaClient.js";

// Helper function to normalize date (set to beginning of day)
const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

// Helper function to format date for display
const formatDateForDisplay = (date) => {
  return date.toLocaleDateString('so-SO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const createDailyQuran = async (req, res) => {
  try {
    const { student, status, class: classId, date, currentSurah, taxdiid, notes } = req.body;

    // Validate required fields
    if (!student || !status) {
      return res.status(400).json({
        success: false,
        message: "Fadlan geli ardayga iyo heerka"
      });
    }

    // Validate student exists
    const studentExists = await prisma.student.findUnique({
      where: { id: student }
    });
    
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Ardayga lama helin"
      });
    }

    // Use provided date or today's date
    const sessionDate = date ? normalizeDate(date) : normalizeDate(new Date());

    // Check if session already exists for this student on this date
    const existingSession = await prisma.dailyQuran.findFirst({
      where: {
        studentId: student,
        date: {
          gte: sessionDate,
          lt: new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000) // Next day
        }
      }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "Casharka maalinle ardaygan waa hore u diiwaan gashan yahay",
        data: existingSession
      });
    }

    // Get class ID from student if not provided
    const actualClassId = classId || studentExists.classId;

    // Validate class exists
    const classExists = await prisma.class.findUnique({
      where: { id: actualClassId }
    });
    
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Fasalka lama helin"
      });
    }

    // Create session with specific date and new fields
    const dailyQuran = await prisma.dailyQuran.create({
      data: {
        studentId: student,
        status,
        classId: actualClassId,
        date: sessionDate,
        currentSurah: currentSurah || "",
        taxdiid: taxdiid || "",
        notes: notes || ""
      },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true,
            motherNumber: true,
            fatherNumber: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Casharka quraanka maalinle waa lagu daray",
      data: dailyQuran
    });
  } catch (error) {
    console.error('Error creating daily Quran session:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update daily Quran session
// @route   PUT /api/daily-quran/:id
// @access  Private/Teacher
export const updateDailyQuran = async (req, res) => {
  try {
    const { status, date, currentSurah, taxdiid, notes } = req.body;

    const dailyQuran = await prisma.dailyQuran.findUnique({
      where: { id: req.params.id }
    });

    if (!dailyQuran) {
      return res.status(404).json({
        success: false,
        message: "Casharka lama helin"
      });
    }

    // Prepare update data
    const updateData = {};
    
    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    // Update date if provided
    if (date) {
      updateData.date = normalizeDate(date);
    }

    // Update new fields if provided
    if (currentSurah !== undefined) {
      updateData.currentSurah = currentSurah;
    }
    if (taxdiid !== undefined) {
      updateData.taxdiid = taxdiid;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedDailyQuran = await prisma.dailyQuran.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true,
            motherNumber: true,
            fatherNumber: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: `Casharka waa la cusboonaysiiyay`,
      data: updatedDailyQuran
    });
  } catch (error) {
    console.error('Error updating daily Quran session:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message
    });
  }
};

// @desc    Get student sessions with date range filter
// @route   GET /api/daily-quran/student/:studentId
// @access  Private/Teacher
export const getStudentSessions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { studentId } = req.params;
    
    let whereClause = { studentId: studentId };

    // Filter by date range
    if (startDate && endDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Taariikhda aad gelisay waa khalad"
          });
        }

        // Normalize times
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        whereClause.date = {
          gte: start,
          lte: end
        };
      } catch (dateError) {
        return res.status(400).json({
          success: false,
          message: "Taariikhda aad gelisay waa khalad"
        });
      }
    } else if (startDate || endDate) {
      // If only one date is provided
      return res.status(400).json({
        success: false,
        message: "Waa inaad gelisaa taariikhda bilowga iyo taariikhda dhamaadka"
      });
    }

    const sessions = await prisma.dailyQuran.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate statistics
    const totalSessions = sessions.length;
    const passedSessions = sessions.filter(s => s.status === 'gartay').length;
    const failedSessions = sessions.filter(s => s.status === 'garan waayay').length;
    const absentSessions = sessions.filter(s => s.status === 'majoogo').length;
    
    const percentage = totalSessions > 0 ? Math.round((passedSessions / totalSessions) * 100) : 0;

    // Format dates for response
    const formattedSessions = sessions.map(session => ({
      ...session,
      date: session.date ? session.date.toISOString().split('T')[0] : null,
      formattedDate: session.date ? formatDateForDisplay(session.date) : null
    }));

    res.status(200).json({
      success: true,
      data: formattedSessions,
      statistics: {
        total: totalSessions,
        passed: passedSessions,
        failed: failedSessions,
        absent: absentSessions,
        percentage: percentage
      },
      filters: {
        studentId,
        startDate: startDate || 'All',
        endDate: endDate || 'All',
        dateRangeApplied: !!(startDate && endDate)
      }
    });
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay markii la raadinayay diiwaanada casharka",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get today's sessions for a class
// @route   GET /api/daily-quran/today/:classId
// @access  Private/Teacher
export const getTodaySessions = async (req, res) => {
  try {
    const today = normalizeDate(new Date());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const sessions = await prisma.dailyQuran.findMany({
      where: {
        classId: req.params.classId,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true,
            motherNumber: true,
            fatherNumber: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      date: today.toISOString().split('T')[0],
      data: sessions
    });
  } catch (error) {
    console.error('Error getting today sessions:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message
    });
  }
};

// @desc    Bulk create sessions for multiple students WITH SPECIFIC DATE
// @route   POST /api/daily-quran/bulk
// @access  Private/Teacher
export const createBulkSessions = async (req, res) => {
  try {
    console.log('Bulk create sessions called with body:', req.body);
    const { classId, students, date } = req.body;

    // Validate required fields
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Fadlan geli ardayda"
      });
    }

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Fadlan geli fasalka"
      });
    }

    // Validate class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Fasalka lama helin"
      });
    }

    // Use provided date or today's date
    const sessionDate = date ? normalizeDate(date) : normalizeDate(new Date());
    const nextDay = new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000);

    // Get all students from the class
    const classStudents = await prisma.student.findMany({
      where: { classId: classId },
      select: { id: true }
    });
    const classStudentIds = classStudents.map(s => s.id);

    const sessions = [];
    const errors = [];
    const updatedSessions = [];
    const skippedStudents = [];

    for (const item of students) {
      try {
        // Validate student data
        if (!item.studentId || !item.status) {
          errors.push(`Ardayga macluumaadkiisu waa ba'an (ID: ${item.studentId || 'laaan'})`);
          continue;
        }

        // Check if student exists
        const studentExists = await prisma.student.findUnique({
          where: { id: item.studentId }
        });
        if (!studentExists) {
          errors.push(`Ardayga ID ${item.studentId} lama helin`);
          continue;
        }

        // Check if student belongs to the class
        if (!classStudentIds.includes(item.studentId)) {
          errors.push(`Ardayga ${studentExists.fullname} ma aha fasalkan ${classExists.name}`);
          continue;
        }

        // Check if session already exists for this date
        const existingSession = await prisma.dailyQuran.findFirst({
          where: {
            studentId: item.studentId,
            classId: classId,
            date: {
              gte: sessionDate,
              lt: nextDay
            }
          }
        });

        if (existingSession) {
          // Check if status is different
          if (existingSession.status !== item.status) {
            // Update existing session
            const updatedSession = await prisma.dailyQuran.update({
              where: { id: existingSession.id },
              data: {
                status: item.status,
                currentSurah: item.currentSurah || "",
                taxdiid: item.taxdiid || "",
                notes: item.notes || ""
              },
              include: {
                student: {
                  select: {
                    id: true,
                    fullname: true,
                    studentId: true,
                    phone: true
                  }
                },
                class: {
                  select: {
                    id: true,
                    name: true,
                    level: true
                  }
                }
              }
            });
            
            updatedSessions.push(updatedSession);
          } else {
            // Same status, skip
            const populatedSession = await prisma.dailyQuran.findUnique({
              where: { id: existingSession.id },
              include: {
                student: {
                  select: {
                    id: true,
                    fullname: true,
                    studentId: true,
                    phone: true
                  }
                },
                class: {
                  select: {
                    id: true,
                    name: true,
                    level: true
                  }
                }
              }
            });
            skippedStudents.push({
              student: populatedSession.student,
              reason: 'Casharka hore u diiwaan gashan yahay'
            });
          }
        } else {
          // Create new session
          const session = await prisma.dailyQuran.create({
            data: {
              studentId: item.studentId,
              status: item.status,
              classId: classId,
              date: sessionDate,
              currentSurah: item.currentSurah || "",
              taxdiid: item.taxdiid || "",
              notes: item.notes || ""
            },
            include: {
              student: {
                select: {
                  id: true,
                  fullname: true,
                  studentId: true,
                  motherNumber: true,
                  fatherNumber: true
                }
              },
              class: {
                select: {
                  id: true,
                  name: true,
                  level: true
                }
              }
            }
          });
          
          sessions.push(session);
        }
      } catch (error) {
        console.error(`Error processing student ${item.studentId}:`, error);
        errors.push(`Khalad ku dhacay ardayga ${item.studentId}: ${error.message}`);
      }
    }

    // Combine all results
    const allSessions = [...sessions, ...updatedSessions];

    res.status(201).json({
      success: true,
      message: `${
        sessions.length > 0 ? `${sessions.length} cashar cusub ayaa lagu daray` : ''
      }${
        updatedSessions.length > 0 ? `${sessions.length > 0 ? ', ' : ''}${updatedSessions.length} cashar ayaa la cusboonaysiiyay` : ''
      }${
        (sessions.length === 0 && updatedSessions.length === 0) ? 'Wax cashar cusub ah lagama darin' : ''
      }`,
      summary: {
        date: sessionDate.toISOString().split('T')[0],
        class: classExists.name,
        totalStudents: classStudentIds.length,
        newSessions: sessions.length,
        updatedSessions: updatedSessions.length,
        skipped: skippedStudents.length,
        errors: errors.length
      },
      data: allSessions,
      skipped: skippedStudents.length > 0 ? skippedStudents : undefined,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error creating bulk sessions:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay markii la sameeynayo casharrada badan",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete daily Quran session
// @route   DELETE /api/daily-quran/:id
// @access  Private/Teacher
export const deleteDailyQuran = async (req, res) => {
  try {
    const session = await prisma.dailyQuran.findUnique({
      where: { id: req.params.id }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Casharka lama helin"
      });
    }

    await prisma.dailyQuran.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: "Casharka waa la tirtiray",
      data: {}
    });
  } catch (error) {
    console.error('Error deleting daily Quran session:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message
    });
  }
};

// @desc    Get sessions for a specific class and date
// @route   GET /api/daily-quran/class/:classId/date/:date
// @access  Private/Teacher
export const getClassSessionsByDate = async (req, res) => {
  try {
    const { classId, date } = req.params;

    console.log('Getting class sessions by date:', { classId, date });

    // Validate parameters
    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "Fadlan geli fasalka iyo taariikhda"
      });
    }

    // Validate class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Fasalka lama helin"
      });
    }

    // Parse and normalize date
    let sessionDate;
    try {
      sessionDate = normalizeDate(date);
      if (isNaN(sessionDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (dateError) {
      return res.status(400).json({
        success: false,
        message: "Taariikhda aad gelisay waa khalad"
      });
    }

    const nextDay = new Date(sessionDate);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log('Date range for query:', {
      sessionDate: sessionDate.toISOString(),
      nextDay: nextDay.toISOString()
    });

    // Get all sessions for this class and date
    const sessions = await prisma.dailyQuran.findMany({
      where: {
        classId: classId,
        date: {
          gte: sessionDate,
          lt: nextDay
        }
      },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true,
            fatherNumber: true,
            motherNumber: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${sessions.length} sessions for date ${date}`);

    // Get all students in the class
    const allStudents = await prisma.student.findMany({
      where: { classId: classId },
      select: {
        id: true,
        fullname: true,
        studentId: true,
        fatherNumber: true,
        motherNumber: true
      },
      orderBy: {
        fullname: 'asc'
      }
    });

    console.log(`Found ${allStudents.length} students in class`);

    // Map sessions to student IDs
    const sessionMap = {};
    sessions.forEach(session => {
      if (session.student && session.student.id) {
        sessionMap[session.student.id] = session;
      }
    });

    // Create complete attendance list
    const attendanceList = allStudents.map(student => {
      const existingSession = sessionMap[student.id];

      if (existingSession) {
        return {
          student: student,
          session: existingSession,
          status: existingSession.status,
          present: true,
          date: sessionDate.toISOString()
        };
      } else {
        return {
          student: student,
          session: null,
          status: 'majoogo',
          present: false,
          date: sessionDate.toISOString()
        };
      }
    });

    // Calculate statistics
    const totalStudents = attendanceList.length;
    const presentCount = attendanceList.filter(item => item.present).length;
    const gartayCount = attendanceList.filter(item => item.status === 'gartay').length;
    const garanWaayayCount = attendanceList.filter(item => item.status === 'garan waayay').length;
    const majoogoCount = attendanceList.filter(item => item.status === 'majoogo').length;

    res.status(200).json({
      success: true,
      data: {
        class: classExists,
        date: sessionDate.toISOString().split('T')[0],
        formattedDate: formatDateForDisplay(sessionDate),
        totalStudents: totalStudents,
        sessions: sessions,
        attendanceList: attendanceList,
        statistics: {
          total: totalStudents,
          present: presentCount,
          absent: totalStudents - presentCount,
          gartay: gartayCount,
          garanWaayay: garanWaayayCount,
          majoogo: majoogoCount,
          attendanceRate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0,
          successRate: presentCount > 0 ? Math.round((gartayCount / presentCount) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error in getClassSessionsByDate:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay markii la raadinayay casharrada",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all sessions for a class (with optional date parameter)
// @route   GET /api/daily-quran/class/:classId
// @access  Private/Teacher
export const getClassSessions = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, startDate, endDate } = req.query;

    let whereClause = { classId: classId };

    // Filter by single date
    if (date) {
      const sessionDate = normalizeDate(date);
      const nextDay = new Date(sessionDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.date = {
        gte: sessionDate,
        lt: nextDay
      };
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      end.setHours(23, 59, 59, 999);

      whereClause.date = {
        gte: start,
        lte: end
      };
    }

    const sessions = await prisma.dailyQuran.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true,
            phone: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
      filters: {
        date: date || null,
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error('Error getting class sessions:', error);
    res.status(500).json({
      success: false,
      message: "Khalad ayaa dhacay",
      error: error.message
    });
  }
};