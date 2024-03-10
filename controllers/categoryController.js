const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Create a new category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required", "Bad Request");
  }

  const categoryExists = await categoryModel.findOne({ name: name });
  if (categoryExists) {
    throw new ApiError(400, "Category already exists", "Bad Request");
  }

  const category = await categoryModel.create({ name, description });
  if (!category) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Category created successfully", category));
});

// Get all categories
exports.getAllCategories = asyncHandler(async (_, res) => {
  const categories = await categoryModel.find({});
  if (!categories) {
    throw new ApiError(404, "No categories found", "Not Found");
  }
  res.status(200).json(new ApiResponse(200, categories, "Categories found"));
});
// Get a single category
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, "Category not found", "Not Found");
  }
  res.status(200).json(new ApiResponse(200, "Category found", category));
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Category updated successfully", category));
});

// Delete a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, "Category not found", "Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Category deleted successfully", category));
});
