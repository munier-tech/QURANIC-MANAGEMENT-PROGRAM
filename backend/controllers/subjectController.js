// controllers/subjectController.js
import prisma from "../lib/prismaClient.js";

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private/Admin
export const createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if subject already exists
    const subjectExists = await prisma.subject.findUnique({
      where: { name }
    });

    if (subjectExists) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code
      }
    });

    res.status(201).json({
      _id: subject.id,
      name: subject.name,
      code: subject.code,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Server error while creating subject' });
  }
};

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    });

    res.status(200).json({
      count: subjects.length,
      subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error while fetching subjects' });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.subjectId }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ message: 'Server error while fetching subject' });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
export const updateSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: req.params.subjectId }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== subject.name) {
      const subjectExists = await prisma.subject.findUnique({
        where: { name }
      });
      if (subjectExists) {
        return res.status(400).json({ message: 'Subject with this name already exists' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (code !== undefined) updateData.code = code;

    const updatedSubject = await prisma.subject.update({
      where: { id: req.params.subjectId },
      data: updateData
    });

    res.status(200).json({
      _id: updatedSubject.id,
      name: updatedSubject.name,
      code: updatedSubject.code,
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ message: 'Server error while updating subject' });
  }
};


export const deleteSubject = async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.subjectId }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await prisma.subject.delete({
      where: { id: req.params.subjectId }
    });

    res.status(200).json({ message: 'Subject removed successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Server error while deleting subject' });
  }
};
