import { readAccessToken } from "../utils/auth.utils.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token is required"
    });
  }

  try {
    const decoded = readAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token"
    });
  }
}