import prisma from "../lib/prismaClient.js";



export const addHealthRecord = async (req, res) => {
  try {

    const { student , date , condition , treated , note } = req.body;


    if (!student || !date || !condition || treated === undefined) {
      return res.status(400).json({ message: "Fadlann buuxi dhammaan meelaha ban banan" });
    }

    // Check if the student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: student }
    });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const healthRecord = await prisma.health.create({
      data: {
        studentId: student,
        date: date ? new Date(date) : new Date(),
        condition,
        treated,
        note: note || ""
      },
      include: {
        student: true
      }
    });

    return res.status(201).json({ message: "Diiwaanka caafimaadka si guul leh ayaa loo abuuray", healthRecord });
    
  } catch (error) {
    console.error("Error creating Health record:", error);
    return res.status(500).json({ message: "Error creating Health record" });
  }
}



export const getStudentHealthRecords = async (req, res) => {
   const  { studentId  } = req.params;

   try {
       const student = await prisma.student.findUnique({
         where: { id: studentId },
         include: {
           healthRecords: {
             orderBy: { createdAt: 'desc' }
           }
         }
       });
       
       if (!student) {
           return res.status(404).json({ message: "Arday lama helin" });
       }

       res.status(200).json({ studentHealthRecords: student.healthRecords });
   } catch (error) {
       console.error("Error fetching Health records:", error);
       res.status(500).json({ message: "Error fetching Health records" });
   }
}

export const getAllHealthRecords = async (req, res) => {
  try {

    const healthRecords = await prisma.health.findMany({
      include: {
        student: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ healthRecords });
    
  } catch (error) {
    console.error("Error fetching all Health records:", error);
    res.status(500).json({ message: "Error fetching all Health records" });
  }
}



export const updateHealthRecord = async (req, res) => {
  try {
    const { healthId } = req.params;
    const { date, condition, treated, note } = req.body;

    const existingRecord = await prisma.health.findUnique({
      where: { id: healthId }
    });
    
    if (!existingRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    const updatedData = {
      date: date ? new Date(date) : existingRecord.date,
      condition: condition || existingRecord.condition,
      treated: treated !== undefined ? treated : existingRecord.treated,
      note: note || existingRecord.note
    };

    const updated = await prisma.health.update({
      where: { id: healthId },
      data: updatedData
    });

    res.status(200).json({
      message: "Health record updated successfully",
      Health: updated
    });
  } catch (error) {
    console.error("Error updating Health record:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    const { healthId } = req.params;

    const health = await prisma.health.findUnique({
      where: { id: healthId }
    });
    
    if (!health) {
      return res.status(404).json({ message: "Health record not found" });
    }

    await prisma.health.delete({
      where: { id: healthId }
    });

    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Error deleting health record:", error);
    res.status(500).json({ message: error.message });
  }
};
