const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  publicationDate: { type: Date, default: Date.now },
});

articleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Article", articleSchema);
