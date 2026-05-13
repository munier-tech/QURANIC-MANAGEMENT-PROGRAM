import prisma from "../lib/prismaClient.js";

// Create salary record for a teacher
export const createSalaryRecord = async (req, res) => {
  try {
    const { teacher, amount, month, year, bonus, deductions, note } = req.body;

    if (!teacher || !amount || !month || !year) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha banan" });
    }

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacher }
    });
    
    if (!existingTeacher) {
      return res.status(404).json({ message: "Macalinka lama helin" });
    }

    // Check if salary record already exists for this teacher, month, and year
    const existingSalary = await prisma.salary.findFirst({
      where: { teacherId: teacher, month, year }
    });
    
    if (existingSalary) {
      return res.status(400).json({ message: "Mushaharka bishan macalinka horay ayaa loo abuuray" });
    }

    // ✅ Calculate totalAmount
    const totalAmount = Number(amount) + Number(bonus || 0) - Number(deductions || 0);

    const salaryRecord = await prisma.salary.create({
      data: {
        teacherId: teacher,
        amount,
        month,
        year,
        bonus: bonus || 0,
        deductions: deductions || 0,
        totalAmount, // ✅ include required field
        note: note || "",
        paid: true, // ✅ Mark as paid directly
        paidDate: new Date(), // ✅ Set payment date
        createdById: req.user.id
      },
      include: {
        teacher: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      message: "Diiwaanka mushaharka si guul leh ayaa loo abuuray",
      salaryRecord
    });

  } catch (error) {
    console.error("Error creating salary record:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay diiwaanka mushaharka abuurista" });
  }
};


// Create salaries for all teachers
export const createAllTeachersSalaries = async (req, res) => {
  try {
    const { amount, month, year, bonus, deductions, note } = req.body;

    if (!amount || !month || !year) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha banan" });
    }

    // Get all teachers
    const teachers = await prisma.teacher.findMany();
    if (teachers.length === 0) {
      return res.status(400).json({ message: "Macalimiin lama helin" });
    }

    const salaryRecords = [];
    const existingSalaries = [];

    for (const teacher of teachers) {
      // Check if salary already exists for this teacher
      const existingSalary = await prisma.salary.findFirst({ 
        where: { 
          teacherId: teacher.id, 
          month, 
          year 
        }
      });

      if (existingSalary) {
        existingSalaries.push(teacher.name);
        continue;
      }

      const salaryRecord = await prisma.salary.create({
        data: {
          teacherId: teacher.id,
          amount,
          month,
          year,
          bonus: bonus || 0,
          deductions: deductions || 0,
          totalAmount: Number(amount) + Number(bonus || 0) - Number(deductions || 0), // ✅ Calculate totalAmount
          note: note || "",
          paid: true, // ✅ Mark as paid directly
          paidDate: new Date(), // ✅ Set payment date
          createdById: req.user.id
        }
      });
      salaryRecords.push(salaryRecord);
    }

    let message = `${salaryRecords.length} diiwaanka mushaharka si guul leh ayaa loo abuuray`;
    if (existingSalaries.length > 0) {
      message += `. ${existingSalaries.length} macalin horay ayaa mushaharkooda la abuuray: ${existingSalaries.join(', ')}`;
    }

    return res.status(201).json({ 
      message, 
      created: salaryRecords.length,
      existing: existingSalaries.length,
      salaryRecords 
    });

  } catch (error) {
    console.error("Error creating teacher salaries:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay mushaharka macaliminta abuurista" });
  }
};

// Get all salary records
export const getAllSalaryRecords = async (req, res) => {
  try {
    const { month, year, paid } = req.query;
    
    let where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (paid !== undefined) where.paid = paid === 'true';

    const salaryRecords = await prisma.salary.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true
          }
        },
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ 
      message: "Diiwaanka mushaharka si guul leh ayaa loo helay", 
      salaryRecords 
    });

  } catch (error) {
    console.error("Error getting salary records:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay diiwaanka mushaharka soo bandhigista" });
  }
};

// Get salary records for a specific teacher
export const getTeacherSalaryRecords = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { year } = req.query;

    let where = { teacherId };
    if (year) where.year = parseInt(year);

    const salaryRecords = await prisma.salary.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true
          }
        },
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    return res.status(200).json({ 
      message: "Diiwaanka mushaharka macalinka si guul leh ayaa loo helay", 
      salaryRecords 
    });

  } catch (error) {
    console.error("Error getting teacher salary records:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay diiwaanka mushaharka macalinka soo bandhigista" });
  }
};

// Update salary record (mark as paid/unpaid, update amounts)
export const updateSalaryRecord = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { amount, bonus, deductions, paid, paidDate, note } = req.body;

    const salaryRecord = await prisma.salary.findUnique({
      where: { id: salaryId }
    });
    
    if (!salaryRecord) {
      return res.status(404).json({ message: "Diiwaanka mushaharka lama helin" });
    }

    // Prepare update data
    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (bonus !== undefined) updateData.bonus = bonus;
    if (deductions !== undefined) updateData.deductions = deductions;
    if (paid !== undefined) {
      updateData.paid = paid;
      updateData.paidDate = paid ? (paidDate ? new Date(paidDate) : new Date()) : null;
    }
    if (note !== undefined) updateData.note = note;

    const updatedSalaryRecord = await prisma.salary.update({
      where: { id: salaryId },
      data: updateData,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true
          }
        },
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return res.status(200).json({ 
      message: "Diiwaanka mushaharka si guul leh ayaa loo cusboonaysiiyay", 
      salaryRecord: updatedSalaryRecord
    });

  } catch (error) {
    console.error("Error updating salary record:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay diiwaanka mushaharka cusboonaysiinta" });
  }
};

// Delete salary record
export const deleteSalaryRecord = async (req, res) => {
  try {
    const { salaryId } = req.params;

    const salaryRecord = await prisma.salary.findUnique({
      where: { id: salaryId }
    });
    
    if (!salaryRecord) {
      return res.status(404).json({ message: "Diiwaanka mushaharka lama helin" });
    }

    await prisma.salary.delete({
      where: { id: salaryId }
    });

    return res.status(200).json({ 
      message: "Diiwaanka mushaharka si guul leh ayaa loo tirtay" 
    });

  } catch (error) {
    console.error("Error deleting salary record:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay diiwaanka mushaharka tirista" });
  }
};

// Get salary statistics
export const getSalaryStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const totalSalaries = await prisma.salary.count({ where });
    const paidSalaries = await prisma.salary.count({ 
      where: { ...where, paid: true } 
    });
    const unpaidSalaries = totalSalaries - paidSalaries;
    
    const totalAmountAgg = await prisma.salary.aggregate({
      where,
      _sum: { totalAmount: true }
    });

    const paidAmountAgg = await prisma.salary.aggregate({
      where: { ...where, paid: true },
      _sum: { totalAmount: true }
    });

    return res.status(200).json({
      message: "Tirakoobka mushaharka si guul leh ayaa loo helay",
      statistics: {
        totalSalaries,
        paidSalaries,
        unpaidSalaries,
        totalAmount: totalAmountAgg._sum.totalAmount || 0,
        paidAmount: paidAmountAgg._sum.totalAmount || 0,
        unpaidAmount: (totalAmountAgg._sum.totalAmount || 0) - (paidAmountAgg._sum.totalAmount || 0)
      }
    });
  } catch (error) {
    console.error("Error getting salary statistics:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay tirakoobka mushaharka soo bandhigista" });
  }
};

// Get all teachers for salary management
export const getAllTeachers = async (req, res) => {
  try {
    const { month, year } = req.query;

    const teachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' }
    });

    // If month and year are provided, get salary records
    let teachersWithSalaries = teachers;
    if (month && year) {
      teachersWithSalaries = await Promise.all(
        teachers.map(async (teacher) => {
          const salaryRecord = await prisma.salary.findFirst({
            where: {
              teacherId: teacher.id,
              month: parseInt(month),
              year: parseInt(year)
            }
          });

          return {
            ...teacher,
            salaryRecord
          };
        })
      );
    }

    return res.status(200).json({ 
      message: "Macaliminta si guul leh ayaa loo helay", 
      teachers: teachersWithSalaries 
    });

  } catch (error) {
    console.error("Error getting teachers:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay macaliminta soo bandhigista" });
  }
};

// Update all unpaid salaries to be paid
export const markAllSalariesAsPaid = async (req, res) => {
  try {
    const result = await prisma.salary.updateMany({
      where: { paid: false }, // Find all unpaid salaries
      data: {
        paid: true,
        paidDate: new Date()
      }
    });

    return res.status(200).json({
      message: `${result.count} diiwaanka mushaharka si guul leh ayaa loo cusboonaysiiyay oo loo calaamadeeyay in la bixiyay`,
      modifiedCount: result.count
    });

  } catch (error) {
    console.error("Error updating salaries:", error);
    return res.status(500).json({ message: "Khalad ayaa dhacay cusboonaysiinta mushaharka" });
  }
};