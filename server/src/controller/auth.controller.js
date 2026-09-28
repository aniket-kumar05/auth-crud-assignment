import bcrypt from "bcryptjs";
import UserModel from "../models/auth.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenVerify,
} from "../utils/auth.utils.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        message: "Email already registered. Please log in.",
        errors: [
          {
            field: "email",
            message: "Email already registered",
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        }
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    // Save refresh token to database for revocation support
    await UserModel.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = refreshTokenVerify(refreshToken);
    } catch (err) {
      res.clearCookie("refreshToken");
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const { userId } = decoded;
    const user = await UserModel.findById(userId);

    if (!user || user.refreshToken !== refreshToken) {
      // Possible token reuse attack or revoked token -> clear token in DB if user found
      if (user) {
        await UserModel.findByIdAndUpdate(user._id, { refreshToken: "" });
      }
      res.clearCookie("refreshToken");
      return res.status(403).json({
        message: "Invalid refresh token / session expired",
      });
    }

    // Generate rotated tokens
    const newAccessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error during token refresh:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { refreshToken: "" });
    }
    
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await UserModel.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error during getMe:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
