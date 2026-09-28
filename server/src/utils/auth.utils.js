import jwt from "jsonwebtoken";
import ENV from "../ENV/index.js";
export const generateAccessToken = ({ userId, role }) => {
  const accessToken = jwt.sign({ userId, role }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
};

export const generateRefreshToken = ({ userId, role }) => {
  const refreshToken = jwt.sign({ userId, role }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

//to read refreshToken data

export const refreshTokenVerify = (token) =>{
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET)
}

export const readAccessToken = (accessToken) => {
  return jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET)
}