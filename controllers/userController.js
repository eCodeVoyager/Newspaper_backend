const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// generate Access token and refresh token combine Method
const generateTokens = (user) => {
  try {
    const accessToken = user.generateAccessToken();
    if (!accessToken) {
      throw new ApiError(
        500,
        "Failed to genarate access Token",
        "Internal Server Error"
      );
    }
    const refreshToken = user.generateRefreshToken();
    if (!refreshToken) {
      throw new ApiError(
        500,
        "Failed to genarate refresh Token",
        "Internal Server Error"
      );
    }
    user.refreshToken = refreshToken;
    user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message, "Internal Server Error");
  }
};

//cookie Config
const cookieConfig = {
  httpOnly: true,
  secure: true,
};

// Register a new user
exports.registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required", "Bad Request");
  }
  if (!password) {
    throw new ApiError(400, "Password is required", "Bad Request");
  }

  // create user in database
  const user = await userModel.create({ email, password });
  if (!user) {
    throw new ApiError(400, "Missing required fields", "Bad Request");
  }
  // generate access token and refresh token
  const { accessToken, refreshToken } = generateTokens(user);
  const sanitizedUserData = { ...user.toObject() }; // convert to object to remove the password field
  delete sanitizedUserData.password;

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieConfig)
    .cookie("accessToken", accessToken, cookieConfig)
    .json(
      new ApiResponse(201, sanitizedUserData, "User registered successfully")
    );
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required", "Bad Request");
  }
  if (!password) {
    throw new ApiError(400, "Password is required", "Bad Request");
  }
  // find user in database
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found", "Not Found");
  }
  // compare password
  const isMatch = await user.checkPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials", "Unauthorized");
  }
  // generate access token and refresh token
  const { accessToken, refreshToken } = generateTokens(user);
  const sanitizedUserData = { ...user.toObject() }; // convert to object to remove the password field
  delete sanitizedUserData.password;

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieConfig)
    .cookie("accessToken", accessToken, cookieConfig)
    .json(
      new ApiResponse(200, sanitizedUserData, "User logged in successfully")
    );
});

// Logout user
exports.logoutUser = asyncHandler(async (req, res) => {
  id = req.user._id;
  if (!id) {
    throw new ApiError(401, "User Not Found", "already logged out");
  }
  const dbprocess = await userModel.findByIdAndUpdate(
    id,
    { $set: { refreshToken: "" } },
    { new: true, useFindAndModify: false }
  );
  if (!dbprocess) {
    throw new ApiError(401, "User Not Found", "already logged out");
  }
  return res
    .clearCookie("refreshToken", cookieConfig)
    .clearCookie("accessToken", cookieConfig)
    .status(200)
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  id = req.user._id;
  if (!id) {
    throw new ApiError(401, "User Not Found", "Unauthorized Access");
  }
  const dbprocess = await userModel.findByIdAndDelete(id);
  if (!dbprocess) {
    throw new ApiError(401, "User Not Found", "Unauthorized Access");
  }
  return res
    .clearCookie("refreshToken", cookieConfig)
    .clearCookie("accessToken", cookieConfig)
    .status(200)
    .json({
      success: true,
      message: "User Deleted Successfully",
    });
});

//upaate user
exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { name, bio, fevCategory, DOB } = req.body; //DOB format should be "YYYY-MM-DD" from client
  if (!id) {
    throw new ApiError(401, "User Not Found", "Unauthorized Access");
  }

  const dbprocess = await userModel.findByIdAndUpdate(
    id,
    { $set: { name, bio, fevCategory, DOB } },
    { new: true, useFindAndModify: false }
  );
  if (!dbprocess) {
    throw new ApiError(401, "User Not Found", "Unauthorized Access");
  }
  return res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
});
