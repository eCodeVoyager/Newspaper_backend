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
  const { name, description } = req.body;
  if (!name && !description) {
    throw new ApiError(400, "Name or description is required", "Bad Request");
  }

  const categoryID = req.params.id;
  if (!categoryID) {
    throw new ApiError(404, "Category ID must be there", "Bad Request");
  }
  if (categoryID.length !== 24) {
    throw new ApiError(400, "Category ID must be 24 characters", "Bad Request");
  }
  const categoryDB = await categoryModel.findByIdAndUpdate(
    categoryID,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!categoryDB) {
    throw new ApiError(404, "Category Not Found OR Database Error", "Bad Request");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Category updated successfully", categoryDB));
});

// Delete a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = req.params.id;
  if (category === null) {
    throw new ApiError(404, "Category ID must be there", "Bad Request");
  }
  if (category.length !== 24) {
    throw new ApiError(400, "Category ID must be 24 characters", "Bad Request");
  }
  if (!category) {
    throw new ApiError(404, "Category not found", "Not Found");
  }
  const categoryDB = await categoryModel.findByIdAndDelete(req.params.id);
  if (!categoryDB) {
    throw new ApiError(404, "Category not found OR DB error", "Bad Request");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Category deleted successfully", category));
});
