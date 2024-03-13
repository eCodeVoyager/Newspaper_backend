const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const articleModel = require("../models/articleModel");

// Create a new article
exports.createArticle = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required", "Bad Request");
  }
  if (!content) {
    throw new ApiError(400, "Content is required", "Bad Request");
  }
  if (!category) {
    throw new ApiError(400, "Category is required", "Bad Request");
  }

  const categoryExists = await categoryModel.findOne({ name: category });
  if (!categoryExists) {
    throw new ApiError(
      400,
      "Category does not exist || Please create one",
      "Bad Request"
    );
  }

  const article = await articleModel.create({
    title,
    content,
    author: req.user._id,
    category: categoryExists._id,
  });
  if (!article) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  const addarticleToCategory = await categoryModel.findByIdAndUpdate(
    categoryExists._id,
    {
      $push: { articles: article._id },
    },
    { new: true }
  );
  if (!addarticleToCategory) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  const addarticleToUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: { articles: article._id },
    },
    { new: true }
  );
  if (!addarticleToUser) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "article created successfully", article));
});

// Get all articles
exports.getAllarticles = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

  const options = {
    page: page,
    limit: pageSize,
  };

  const articlesPage = await articleModel.paginate({}, options);

  const articles = await articleModel
    .find({})
    .populate({ path: "author", select: "name" })
    .populate({ path: "category", select: "name" });

  if (!articlesPage.docs || articlesPage.docs.length === 0) {
    throw new ApiError(404, "No articles found", "Not Found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        articles: articlesPage.docs,
        totalPages: articlesPage.totalPages,
        currentPage: articlesPage.page,
        pageSize: articlesPage.limit,
        totalArticles: articlesPage.totalDocs,
      },
      "Articles found"
    )
  );
});
// Get a single article
exports.getArticle = asyncHandler(async (req, res) => {
  const articleID = req.params.id;
  if (!articleID) {
    throw new ApiError(400, "article ID is required", "Bad Request");
  }
  if (articleID.length !== 24) {
    throw new ApiError(
      400,
      "Article Id must be 24 characters in legnth",
      "Bad Request"
    );
  }

  const article = await articleModel
    .findById(articleID)
    .populate({ path: "author", select: "name" })
    .populate({ path: "category", select: "name" });
  if (!article) {
    throw new ApiError(404, "article not found", "Not Found");
  }
  res.status(200).json(new ApiResponse(200, "article found", article));
});

// Update a article
exports.updateArticle = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title && !content && !category) {
    throw new ApiError(
      400,
      "Minimum of one field is required to update article",
      "Bad Request"
    );
  }

  const articleID = req.params.id;
  if (!articleID) {
    throw new ApiError(400, "article ID is required", "Bad Request");
  }
  if (articleID.length !== 24) {
    throw new ApiError(
      400,
      "Article Id must be 24 characters in legnth",
      "Bad Request"
    );
  }
  const categoryExists = await categoryModel.findOne({ name: category });
  if (!categoryExists) {
    throw new ApiError(
      404,
      "Category does not exist || Please create one",
      "Bad Request"
    );
  }

  const article = await articleModel.findByIdAndUpdate(
    articleID,
    {
      title,
      content,
      category: categoryExists._id,
    },

    {
      new: true,
      runValidators: true,
    }
  );
  if (!article) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "article updated successfully", article));
});

// Delete a article
exports.deleteArticle = asyncHandler(async (req, res) => {
  const articleID = req.params.id;
  if (!articleID) {
    throw new ApiError(400, "article ID is required", "Bad Request");
  }
  if (articleID.length !== 24) {
    throw new ApiError(
      400,
      "Article Id must be 24 characters in legnth",
      "Bad Request"
    );
  }
  const article = await articleModel.findByIdAndDelete(articleID);
  if (!article) {
    throw new ApiError(404, "article not found", "Not Found");
  }
  // check if the user is the author of the article
  if (req.user._id.toString() !== article.author.toString()) {
    throw new ApiError(401, "Your Not author of this article", "Unauthorized");
  }

  const removearticleFromCategory = await categoryModel.findByIdAndUpdate(
    article.category,
    {
      $pull: { articles: article._id },
    },
    { new: true }
  );
  if (!removearticleFromCategory) {
    throw new ApiError(400, "Database error", "Bad Request");
  }
  const removearticleFromUser = await userModel.findByIdAndUpdate(
    article.author,
    {
      $pull: { articles: article._id },
    },
    { new: true }
  );
  if (!removearticleFromUser) {
    throw new ApiError(400, "Database error", "Bad Request");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "article deleted successfully", article));
});

// Get all articles by category
exports.getarticlesByCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findOne({ name: req.params.name });
  if (!category) {
    throw new ApiError(404, "Category not found", "Not Found");
  }
  const articles = await articleModel.find({ category: category._id });
  if (!articles) {
    throw new ApiError(404, "No articles found", "Not Found");
  }
  res.status(200).json(new ApiResponse(200, articles, "articles found"));
});
