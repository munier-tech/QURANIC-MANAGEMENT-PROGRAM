import prisma from "../lib/prismaClient.js";

export const createHalaqa = async (req, res) => {
  try {
    const { name, description, teacher, startingSurah, taxdiid } = req.body;
    const exists = await prisma.halaqa.findUnique({ where: { name } });
    if (exists) return res.status(400).json({ message: "Halaqa with this name already exists" });

    const halaqa = await prisma.halaqa.create({
      data: { name, description, teacher, startingSurah, taxdiid }
    });
    res.status(201).json(halaqa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllHalaqas = async (_req, res) => {
  try {
    const items = await prisma.halaqa.findMany({
      include: {
        teacher: {
          select: { name: true }
        },
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHalaqaByName = async (req, res) => {
  try {
    const { name } = req.query;
    const item = await prisma.halaqa.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: {
        teacher: {
          select: { name: true }
        },
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    if (!item) return res.status(404).json({ message: "Halaqa not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHalaqaById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.halaqa.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { name: true }
        },
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    if (!item) return res.status(404).json({ message: "Halaqa not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateHalaqa = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const item = await prisma.halaqa.update({
      where: { id },
      data: update,
      include: {
        teacher: {
          select: { name: true }
        },
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteHalaqa = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.halaqa.delete({
      where: { id }
    });
    res.json({ message: "Halaqa deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addStudentsToHalaqa = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body; // array

    const halaqa = await prisma.halaqa.findUnique({
      where: { id },
      include: { students: true }
    });
    if (!halaqa) return res.status(404).json({ message: "Halaqa not found" });

    // ensure students exist
    const validStudents = await prisma.student.findMany({
      where: {
        id: { in: studentIds }
      },
      select: { id: true }
    });
    const validIds = validStudents.map(s => s.id);

    // Add students that aren't already in the halaqa
    const currentStudentIds = halaqa.students.map(s => s.id);
    const studentsToAdd = validIds.filter(id => !currentStudentIds.includes(id));

    if (studentsToAdd.length > 0) {
      await prisma.halaqa.update({
        where: { id },
        data: {
          students: {
            connect: studentsToAdd.map(id => ({ id }))
          }
        }
      });
    }

    const updatedHalaqa = await prisma.halaqa.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    res.json(updatedHalaqa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeStudentFromHalaqa = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const halaqa = await prisma.halaqa.findUnique({
      where: { id }
    });
    if (!halaqa) return res.status(404).json({ message: "Halaqa not found" });

    await prisma.halaqa.update({
      where: { id },
      data: {
        students: {
          disconnect: { id: studentId }
        }
      }
    });

    const updatedHalaqa = await prisma.halaqa.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            fullname: true,
            studentId: true
          }
        }
      }
    });
    res.json(updatedHalaqa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};