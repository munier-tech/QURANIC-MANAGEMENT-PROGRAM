import prisma from "../lib/prismaClient.js";

export const createQuranRecord = async (req, res) => {
  try {
    const { classId, dailyLessonHint, currentSurah, taxdiid, studentStatus, notes, studentPerformances } = req.body;

    const classDoc = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!classDoc) return res.status(404).json({ message: "Fasalka lama helin" });

    // Map studentPerformances to connect students properly
    const mappedPerformances = (studentPerformances || [])
      .filter(perf => perf && (perf.student || perf.studentId))
      .map(perf => ({
        dailyLessonHint: perf.dailyLessonHint || "",
        currentSurah: perf.currentSurah || "",
        taxdiid: perf.taxdiid || "",
        studentStatus: perf.studentStatus || "",
        notes: perf.notes || "",
        student: {
          connect: {
            id: perf.student || perf.studentId
          }
        }
      }));

    const record = await prisma.lessonRecord.create({
      data: {
        type: "quran",
        class: {
          connect: { id: classId }
        },
        quranDailyLessonHint: dailyLessonHint,
        quranCurrentSurah: currentSurah,
        quranTaxdiid: taxdiid,
        quranStudentStatus: studentStatus,
        quranNotes: notes,
        studentPerformances: {
          create: mappedPerformances
        }
      },
      include: {
        class: {
          select: {
            name: true,
            level: true
          }
        },
        studentPerformances: {
          include: {
            student: {
              select: {
                fullname: true,
                studentId: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSubcisRecord = async (req, res) => {
  try {
    const { halaqaId, startingSurah, taxdiid, notes, studentPerformances } = req.body;

    const halaqa = await prisma.halaqa.findUnique({
      where: { id: halaqaId }
    });
    if (!halaqa) return res.status(404).json({ message: "Halaqa not found" });

    // Map studentPerformances to connect students properly
    const mappedPerformances = (studentPerformances || [])
      .filter(perf => perf && (perf.student || perf.studentId))
      .map(perf => ({
        dailyLessonHint: perf.dailyLessonHint || "",
        currentSurah: perf.currentSurah || "",
        taxdiid: perf.taxdiid || "",
        studentStatus: perf.studentStatus || "",
        notes: perf.notes || "",
        student: {
          connect: {
            id: perf.student || perf.studentId
          }
        }
      }));

    const record = await prisma.lessonRecord.create({
      data: {
        type: "subcis",
        halaqa: {
          connect: { id: halaqaId }
        },
        subciStartingSurah: startingSurah,
        subciTaxdiid: taxdiid,
        subciNotes: notes,
        studentPerformances: {
          create: mappedPerformances
        }
      },
      include: {
        halaqa: {
          select: { name: true }
        },
        studentPerformances: {
          include: {
            student: {
              select: {
                fullname: true,
                studentId: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { quaran, subci, studentPerformances, ...flatData } = req.body;

    const record = await prisma.lessonRecord.findUnique({
      where: { id }
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    const updateData = { ...flatData };

    // Handle quran updates if provided
    if (quaran && typeof quaran === 'object') {
      updateData.quranDailyLessonHint = quaran.dailyLessonHint || record.quranDailyLessonHint;
      updateData.quranCurrentSurah = quaran.currentSurah || record.quranCurrentSurah;
      updateData.quranTaxdiid = quaran.taxdiid || record.quranTaxdiid;
      updateData.quranStudentStatus = quaran.studentStatus || record.quranStudentStatus;
      updateData.quranNotes = quaran.notes || record.quranNotes;
    }
    // Handle subci updates if provided
    if (subci && typeof subci === 'object') {
      updateData.subciStartingSurah = subci.startingSurah || record.subciStartingSurah;
      updateData.subciTaxdiid = subci.taxdiid || record.subciTaxdiid;
      updateData.subciNotes = subci.notes || record.subciNotes;
    }
    if (Array.isArray(studentPerformances)) {
      // Delete existing performances and create new ones
      await prisma.lessonRecordStudentPerformance.deleteMany({
        where: { lessonRecordId: id }
      });
      updateData.studentPerformances = {
        create: studentPerformances
      };
    }

    const updatedRecord = await prisma.lessonRecord.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            name: true,
            level: true
          }
        },
        halaqa: {
          select: { name: true }
        },
        studentPerformances: {
          include: {
            student: {
              select: {
                fullname: true,
                studentId: true
              }
            }
          }
        }
      }
    });

    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuranRecordsByClassAndMonth = async (req, res) => {
  try {
    const { classId } = req.params;
    const { month, year } = req.query; // month: 1-12

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    const items = await prisma.lessonRecord.findMany({
      where: {
        type: "quran",
        classId: classId,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        class: {
          select: {
            name: true,
            level: true
          }
        },
        studentPerformances: {
          include: {
            student: {
              select: {
                fullname: true,
                studentId: true
              }
            }
          }
        }
      }
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecordsByHalaqa = async (req, res) => {
  try {
    const { halaqaId } = req.params;
    const items = await prisma.lessonRecord.findMany({
      where: {
        halaqaId: halaqaId
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        halaqa: {
          select: { name: true }
        },
        studentPerformances: {
          include: {
            student: {
              select: {
                fullname: true,
                studentId: true
              }
            }
          }
        }
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lessonRecord.delete({
      where: { id }
    });
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};