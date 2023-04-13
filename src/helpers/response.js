"use strict"

module.exports.sendSuccess =
  (req, res) =>
  (data, status = 200, type) => {
    // console.log(type)
    res.actionStatus = "success"
    const { access_token = "" } = data
    if (access_token) {
      return res
        .cookie("token", access_token, {
          sameSite: "strict",
          secure: false,
          httpOnly: false,
        })
        .status(status)
        .send({
          success: true,
          data,
        })
    }
    return res.status(status).send({
      success: true,
      data,
    })
  }

module.exports.sendError = (req, res) => (error) => {
  res.actionStatus = "failed"
  const code =
    (error.name && error.name === "ValidationError") ||
    "MongoServerError" ||
    "ReferenceError"
      ? 400
      : parseInt(error.code) || 500

  const message = typeof error === "string" ? error : error.message || ""
  return res.status(code).send({
    success: false,
    message,
  })
}
