//helper class to handle errors
function ApiError(statusCode, message, errors, stack) {
  Error.call(this, message);
  this.statusCode = statusCode;
  this.data = null;
  this.message = message || "Something went wrong";
  this.success = false;
  this.errors = errors || [];

  if (stack) {
    this.stack = stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
