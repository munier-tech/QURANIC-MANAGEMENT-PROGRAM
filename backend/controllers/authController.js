import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import { generateTokens, setCookies } from "../helpers/authentication.js";
import prisma from "../lib/prismaClient.js";

export const SignUp = async (req, res) => {
  try {
    const { username, password, email, profilePicture, role } = req.body;

    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "Fadln buuxi dhammaan meelaha looga baahan yahay in la buuxiyo" });
    }

    const normalizedEmail = email?.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Isticmaale horey ayuu u diiwaangashanaa" });
    }

    if (role === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { email: normalizedEmail },
      });

      if (!teacher) {
        return res.status(400).json({ message: "fadlan lama helin macalin , fadlan la xidhiidh maamulka " });
      }
    }

    let cloudinaryResponse = null;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        profilePicture: cloudinaryResponse || "lama keenin sawir",
      },
    });

    const { accessToken } = generateTokens(newUser.id);
    setCookies(res, accessToken);

    res.status(201).json({
      message: "Isticmaalaha si guul leh ayaa loo abuuray",
      user: {
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in SignUp function: ", error);
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fadlan geli iimaylka iyo furaha sirta ah" });
    }

    const normalizedEmail = email?.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          email: {
            equals: normalizedEmail,
            mode: "insensitive",
          },
        },
      });
    }

    if (!user) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const { accessToken } = generateTokens(user.id);
    setCookies(res, accessToken);

    const userData = {
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      message: "Si guul leh ayaad u gashay",
      user: userData,
    });
  } catch (error) {
    console.error("Error in SignIn function: ", error);
    res.status(500).json({
      message: "Khalad server ah",
      code: "SIGNIN_FAILED",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const WhoAmI = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Oggolaansho la'aan - Isticmaale lama helin" });
    }

    const userData = {
      _id: user.id || user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      message: "Isticmaale si guul leh ayaa loo helay",
      user: userData,
    });
  } catch (error) {
    console.error("Error in WhoAmI function: ", error);
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error in getAllUser function: ", error);
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, profilePicture, role } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha looga baahan yahay" });
    }

    let cloudinaryResponse = null;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        role,
        profilePicture: cloudinaryResponse || profilePicture,
      },
    });

    res.status(200).json({
      message: "Isticmaalaha si guul leh ayaa loo cusbooneysiiyay",
      user: {
        _id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in updateUser function: ", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Isticmaale lama helin" });
    }
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({
      message: "Isticmaalaha si guul leh ayaa loo tirtiray",
    });
  } catch (error) {
    console.error("Error in deleteUser function: ", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Isticmaale lama helin" });
    }
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const LogOut = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.status(200).json({
      message: "Waad ka baxday si guul leh",
    });
  } catch (error) {
    console.error("Error in LogOut function: ", error);
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Fadlan geli passwordki hore iyo kan cusub" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user._id } });
    if (!user) {
      return res.status(404).json({ message: "Isticmaalaha lama helin" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Passwordkii hore waa khalad" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user._id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      message: "Erayga sirta ah si guul leh ayaa loo beddelay",
    });
  } catch (error) {
    console.error("Error in ChangePassword function:", error);
    res.status(500).json({
      message: "Khalad server ah",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};
