const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

module.exports = mongoose.model("Category", categorySchema);
