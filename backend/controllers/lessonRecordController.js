import prisma from "../lib/prismaClient.js";

export const createQuranRecord = async (req, res) => {
  try {
    const { classId, dailyLessonHint, currentSurah, taxdiid, studentStatus, notes, studentPerformances } = req.body;

    const classDoc = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!classDoc) return res.status(404).json({ message: "Fasalka lama helin" });

    const record = await prisma.lessonRecord.create({
      data: {
        type: "quran",
        classId: classId,
        quran: {
          dailyLessonHint,
          currentSurah,
          taxdiid,
          studentStatus,
          notes,
        },
        studentPerformances: {
          create: studentPerformances || []
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

    const record = await prisma.lessonRecord.create({
      data: {
        type: "subcis",
        halaqaId: halaqaId,
        subci: {
          startingSurah,
          taxdiid,
          notes,
        },
        studentPerformances: {
          create: studentPerformances || []
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
    const { quran, subci, studentPerformances } = req.body;

    const record = await prisma.lessonRecord.findUnique({
      where: { id }
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    const updateData = {};

    if (quran && typeof quran === 'object') {
      updateData.quran = {
        ...record.quran,
        ...quran
      };
    }
    if (subci && typeof subci === 'object') {
      updateData.subci = {
        ...record.subci,
        ...subci
      };
    }
    if (Array.isArray(studentPerformances)) {
      // Delete existing performances and create new ones
      await prisma.studentPerformance.deleteMany({
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