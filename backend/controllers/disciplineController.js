import prisma from "../lib/prismaClient.js";

// Create discipline record
export const createDiscipline = async (req, res) => {
  try {
    const { student, date, reason, type } = req.body;

    const newRecord = await prisma.discipline.create({
      data: {
        studentId: student,
        date: date ? new Date(date) : new Date(),
        reason,
        type
      },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true
          }
        }
      }
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Failed to create discipline record", error });
  }
};

// Get all discipline records
export const getAllDisciplineRecords = async (req, res) => {
  try {
    const records = await prisma.discipline.findMany({
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discipline records", error });
  }
};

// Get single discipline record by ID
export const getDisciplineById = async (req, res) => {
  try {
    const record = await prisma.discipline.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            studentId: true
          }
        }
      }
    });

    if (!record) {
      return res.status(404).json({ message: "Discipline record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to get discipline record", error });
  }
};

// Update discipline record
export const updateDiscipline = async (req, res) => {
  try {
    const updated = await prisma.discipline.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Discipline record not found" });
    }
    res.status(500).json({ message: "Failed to update discipline record", error });
  }
};

// Delete discipline record
export const deleteDiscipline = async (req, res) => {
  try {
    await prisma.discipline.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ message: "Discipline record deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Discipline record not found" });
    }
    res.status(500).json({ message: "Failed to delete discipline record", error });
  }
};


// Get all discipline records for a specific student
export const getStudentDisciplineRecords = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await prisma.discipline.findMany({
      where: { studentId },
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            class: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discipline records", error });
  }
};