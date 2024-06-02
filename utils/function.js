

function throwCustomError(code, msg) {
    throw new Error(JSON.stringify({code, msg}));
}

function respondWithError(res, error) {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    res.status(status).json({ message });
  }

module.exports = {
    throwCustomError,
    respondWithError
}