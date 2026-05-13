import prisma from "../lib/prismaClient.js";
import cloudinary from "../lib/cloudinary.js";

// Helper to extract Cloudinary public_id from URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  const folderPath = parts.slice(parts.indexOf('teachers')).slice(0, -1).join('/');
  return folderPath ? `${folderPath}/${publicId}` : publicId;
};

// 1. Create Teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, number, email, subject, profilePicture, certificate } = req.body;

    if (!name || !number || !email || !subject) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha loo baahan yahay" });
    }

    // Upload profile picture if provided
    let profileUrl = "no profile picture";
    if (profilePicture) {
      const uploadRes = await cloudinary.uploader.upload(profilePicture, {
        folder: "teachers/profiles",
        resource_type: "image",
      });
      profileUrl = uploadRes.secure_url;
    }

    // Upload certificate if provided
    let certificateUrl = "no certificate";
    if (certificate) {
      const isPdf = certificate.startsWith("data:application/pdf");
      const resourceType = isPdf ? "raw" : "image";

      const certUpload = await cloudinary.uploader.upload(certificate, {
        folder: "teachers/certificates",
        resource_type: resourceType,
        format: isPdf ? "pdf" : undefined,
      });
      certificateUrl = certUpload.secure_url;
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        number,
        email,
        subject,
        profilePicture: profileUrl,
        certificate: certificateUrl,
      },
    });

    res.status(201).json({ message: "Macallinka si guul leh ayaa loo abuuray", teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all Teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ message: "Macallimiinta si guul leh ayaa loo helay", teachers });
  } catch (error) {
    console.error("Error in getAllTeachers:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });
    if (!teacher) return res.status(404).json({ message: "Macallin lama helin" });
    res.status(200).json({ message: "Macallinka si guul leh ayaa loo helay", teacher });
  } catch (error) {
    console.error("Error in getTeacherById:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, number, email, subject, profilePicture, certificate } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });
    if (!teacher) return res.status(404).json({ message: "Macallin lama helin" });

    let updateData = {};

    // Update profile picture if provided
    if (profilePicture) {
      if (teacher.profilePicture && teacher.profilePicture !== "no profile picture") {
        const publicId = getPublicIdFromUrl(teacher.profilePicture);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      }
      const uploadRes = await cloudinary.uploader.upload(profilePicture, {
        folder: "teachers/profiles",
        resource_type: "image",
      });
      updateData.profilePicture = uploadRes.secure_url;
    }

    // Update certificate if provided
    if (certificate) {
      if (teacher.certificate && teacher.certificate !== "no certificate") {
        const publicId = getPublicIdFromUrl(teacher.certificate);
        if (publicId) {
          const resourceType = teacher.certificate.includes('.pdf') ? 'raw' : 'image';
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
      }

      const isPdf = certificate.startsWith("data:application/pdf");
      const resourceType = isPdf ? "raw" : "image";

      const certUpload = await cloudinary.uploader.upload(certificate, {
        folder: "teachers/certificates",
        resource_type: resourceType,
        format: isPdf ? "pdf" : undefined,
      });
      updateData.certificate = certUpload.secure_url;
    }

    // Update other fields
    if (name) updateData.name = name;
    if (number) updateData.number = number;
    if (email) updateData.email = email;
    if (subject) updateData.subject = subject;

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData
    });

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo cusboonaysiiyay", teacher: updatedTeacher });
  } catch (error) {
    console.error("Error in updateTeacher:", error);
    res.status(500).json({ message: error.message });
  }
};

// 5. Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });

    if (!teacher) return res.status(404).json({ message: "Macallin lama helin" });

    // Delete profile picture
    if (teacher.profilePicture && teacher.profilePicture !== "no profile picture") {
      const publicId = getPublicIdFromUrl(teacher.profilePicture);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    // Delete certificate
    if (teacher.certificate && teacher.certificate !== "no certificate") {
      const publicId = getPublicIdFromUrl(teacher.certificate);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    await prisma.teacher.delete({
      where: { id: teacherId }
    });

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    console.error("Error in deleteTeacher:", error);
    res.status(500).json({ message: error.message });
  }
};
