const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const userModel = require("../models/userModel");
require("dotenv").config();

const isUserLoggedin = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, "Please authenticate", "Unauthorized Access");
    }

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new ApiError(401, "Invalid Token", "Unauthorized Access");
    }

    const user = await userModel
      .findOne({
        _id: decoded.id,
      })
      .select("-password -refresh_token");

    if (!user) {
      throw new ApiError(401, "User Not Found", "Unauthorized Access");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle specific JWT errors
      return res.status(401).json({
        error: "Invalid token",
      });
    }
    // Handle other errors
    res.status(401).json({
      error: "Please authenticate",
    });
  }
};

module.exports = isUserLoggedin;
