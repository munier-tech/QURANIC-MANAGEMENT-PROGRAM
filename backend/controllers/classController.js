import prisma from "../lib/prismaClient.js";

// ✅ Abuur fasal cusub
export const createClass = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Fadlan geli magaca fasalka iyo heerka" });
    }

    const existing = await prisma.class.findFirst({
      where: { name }
    });
    if (existing) {
      return res.status(409).json({ message: "Fasalka hore ayuu u diiwaangashanaa" });
    }

    const newClass = await prisma.class.create({
      data: { name, level }
    });

    const payload = { ...newClass, _id: newClass.id };
    res.status(201).json({ message: "Fasal si guul leh ayaa loo abuuray", classData: payload });
  } catch (error) {
    console.error("createClass error:", error);
    res.status(500).json({ message:  error.message });
  }
};

// ✅ Soo hel dhammaan fasalada
export const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: true,
        attendances: true
      }
    });
    const payload = classes.map(c => ({ ...c, _id: c.id }));
    res.status(200).json({ classes: payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Soo hel fasal ID-ga
export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { students: true }
    });

    if (!classData) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    const payload = { ...classData, _id: classData.id };
    res.status(200).json({ classData: payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cusbooneysii fasal
export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, level } = req.body;

    const updated = await prisma.class.update({
      where: { id: classId },
      data: { name, level }
    });

    const payload = { ...updated, _id: updated.id };
    res.status(200).json({ message: "Fasalka si guul leh ayaa loo cusbooneysiiyay", classData: payload });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ✅ Tirtir fasal
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    await prisma.class.delete({
      where: { id: classId }
    });

    res.status(200).json({ message: "Fasalka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ✅ U qoondee arday fasal
export const assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.params;

  try {
    const foundClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { students: true }
    });
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!foundClass || !student) {
      return res.status(404).json({ message: "Fasalka ama ardayga lama helin" });
    }

    if (foundClass.students.some(s => s.id === studentId)) {
      return res.status(400).json({ message: "Ardayga horey ayaa fasalka loogu daray" });
    }

    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentId }
        }
      }
    });

    await prisma.student.update({
      where: { id: studentId },
      data: { classId: classId }
    });

    res.status(200).json({ message: "Ardayga si guul leh ayaa fasalka loogu daray" });
  } catch (error) {
    console.error("Error assigning student:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Ka saar arday fasalka
export const removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    const foundClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { students: true }
    });
    const foundStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!foundClass || !foundStudent) {
      return res.status(404).json({ message: "Fasalka ama ardayga lama helin" });
    }

    if (!foundClass.students.some(s => s.id === studentId)) {
      return res.status(400).json({ message: "Ardayga kuma jiro fasalkan" });
    }

    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId }
        }
      }
    });

    await prisma.student.update({
      where: { id: studentId },
      data: { classId: null }
    });

    res.status(200).json({ message: "Ardayga si guul leh ayaa laga saaray fasalka" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Soo hel xaadiris fasal
export const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    const foundClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        attendance: {
          include: {
            students: {
              include: {
                student: {
                  select: {
                    fullname: true,
                    age: true,
                    gender: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!foundClass) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    res.status(200).json({
      message: "Xaadiriska fasalka si guul leh ayaa loo helay",
      attendance: foundClass.attendance,
    });
  } catch (error) {
    console.error("Error fetching class attendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Soo hel ardayda fasalka
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          select: {
            fullname: true,
            age: true,
            gender: true
          }
        }
      }
    });

    if (!classData) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    res.status(200).json({ students: classData.students });
  } catch (error) {
    console.error("Error fetching class students:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Abuur fasalado badan hal mar
export const createMultipleClasses = async (req, res) => {
  try {
    const { classes } = req.body;

    if (!classes || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Fadlan soo gudbi liis ay ku qoran yihiin fasallo badan"
      });
    }

    const createdClasses = [];
    const errors = [];

    for (const cls of classes) {
      try {
        const { name, level } = cls;

        if (!name || !level) {
          errors.push(`Fasalka "${name || 'mid ka mid ah'}" waxaa ka maqan magaca ama heerka`);
          continue;
        }

        // Check if class already exists
        const existing = await prisma.class.findUnique({
          where: { name: name }
        });
        if (existing) {
          errors.push(`Fasalka "${name}" hore ayuu u diiwaangashanaa`);
          continue;
        }

        // Create new class
        const newClass = await prisma.class.create({
          data: { name, level }
        });
        createdClasses.push(newClass);

      } catch (error) {
        errors.push(`Qalad ku dhacay fasalka "${cls.name}": ${error.message}`);
      }
    }

    // Handle results
    if (errors.length > 0 && createdClasses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Qalado ayaa dhacay markii la abuurinayo fasallada",
        errors: errors
      });
    }

    const response = {
      success: true,
      message: `${createdClasses.length} fasal si guul leh ayaa loo abuuray`,
      classes: createdClasses
    };

    if (errors.length > 0) {
      response.warnings = errors;
      response.message = `${createdClasses.length} fasal ayaa la abuuray, ${errors.length} fasalna way fashilmeen`;
    }

    res.status(201).json(response);

  } catch (error) {
    console.error("Error in createMultipleClasses:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};