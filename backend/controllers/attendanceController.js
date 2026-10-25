import dayjs from "dayjs";
import prisma from "../lib/prismaClient.js";

export const createAttendance = async (req, res) => {
  try {
    const { classId, date, students } = req.body;

    if (!classId || !date || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan xogaha halkan so socda: classId, date, iyo students[]" });
    }

    const foundClass = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!foundClass) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    const normalizedStudents = students.map((s) => ({
      studentId: s.student || s.studentId,
      status: s.status
    }));

    for (const s of normalizedStudents) {
      if (!s.studentId) {
        return res.status(400).json({ message: "Mid kasta oo ardayga ah waa inuu leeyahay student ama studentId" });
      }

      const foundStudent = await prisma.student.findUnique({
        where: { id: s.studentId }
      });
      if (!foundStudent) {
        return res.status(404).json({ message: `Ardayga leh ID-ga ${s.studentId} lama helin` });
      }

      if (!["present", "absent", "late"].includes(s.status)) {
        return res.status(400).json({ message: `Xaalad khaldan ayaa loo qoray ardayga ${s.studentId}` });
      }
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        classId: classId,
        date: new Date(date),
        students: {
          create: normalizedStudents.map((s) => ({
            student: {
              connect: { id: s.studentId }
            },
            status: s.status
          }))
        }
      },
      include: {
        students: true
      }
    });

    res.status(201).json({ message: "Xaadiris si guul leh ayaa loo diiwaangeliyay", attendance: newAttendance });
  } catch (error) {
    console.error("Error in createAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getClassAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.params;

    const parsedDate = dayjs(date, "YYYY-MM-DD", true);

    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: "Qaabka taariikhda waa khaldan. Isticmaal YYYY-MM-DD" });
    }

    const start = parsedDate.startOf("day").toDate();
    const end = parsedDate.endOf("day").toDate();

    const attendance = await prisma.attendance.findFirst({
      where: {
        classId: classId,
        date: {
          gte: start,
          lte: end
        }
      },
      include: {
        students: {
          include: {
            student: {
              select: {
                fullname: true
              }
            }
          }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: `Xaadiris lama helin fasalka iyo taariikhda ${parsedDate.format("YYYY-MM-DD")}` });
    }

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("getClassAttendanceByDate error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { date, students } = req.body;

    if (!date && !students) {
      return res.status(400).json({ message: "Fadlan keen xogta la rabayo in la cusbooneysiiyo: date ama students" });
    }

    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (students && Array.isArray(students)) {
      const normalizedStudents = students.map((s) => ({
        studentId: s.student || s.studentId,
        status: s.status
      }));

      for (const s of normalizedStudents) {
        if (!s.studentId) {
          return res.status(400).json({ message: "Mid kasta oo ardayga ah waa inuu leeyahay student ama studentId" });
        }

        const foundStudent = await prisma.student.findUnique({
          where: { id: s.studentId }
        });
        if (!foundStudent) {
          return res.status(404).json({ message: `Ardayga leh ID-ga ${s.studentId} lama helin` });
        }
      }

      await prisma.attendanceStudent.deleteMany({
        where: { attendanceId: attendanceId }
      });

      updateData.students = {
        create: normalizedStudents.map((s) => ({
          student: {
            connect: { id: s.studentId }
          },
          status: s.status
        }))
      };
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: updateData,
      include: {
        students: true
      }
    });

    res.status(200).json({ message: "Xaadiris si guul leh ayaa loo cusbooneysiiyay", attendance: updatedAttendance });
  } catch (error) {
    console.error("Error in updateAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const deletedAttendance = await prisma.attendance.delete({
      where: { id: attendanceId }
    });

    res.status(200).json({ message: "Xaadiris si guul leh ayaa loo tirtiray" });
  } catch (error) {
    console.error("Error in deleteAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};
