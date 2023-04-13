const jwt = require("jsonwebtoken")

const SECRET_KEY_DEFAULT = "hiepxuan"
const { getModel } = require("../connections/database")
const getAccessToken = (req) => {
  const headerAuthor = (req.headers["authorization"] || "").trim()
  const header = (req.headers["Authorization"] || "").trim()
  const fromXHeader = (req.headers["x-access-token"] || "").trim()

  const fromHeader = fromXHeader || headerAuthor || header

  if (fromHeader) {
    return fromHeader.replace("Bearer ", "").trim()
  }

  return (req.body.token || req.query.token || "") + ""
}

module.exports.authorRoleAdmin = async (req, res, next) => {
  const Account = getModel("Account")
  const token = getAccessToken(req)
  try {
    if (!token) {
      throw new Error("No token provided.")
    } else {
      await jwt.verify(token, SECRET_KEY_DEFAULT, async (err, decoded) => {
        if (err) {
          throw new Error("Something went wrong. Please sign in again.")
        }
        const { id: _id, is_admin, email, role, exp } = decoded
        if (exp * 1000 < Date.now()) throw new Error("Access token invalid")
        const account = await Account.findOne({ _id, email })
        if (!account) throw new Error("Access token invalid")
        if (!is_admin) throw new Error("Access is denied")
        if (!role.includes("admin")) throw new Error("Access is denied")
        next()
      })
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error.message || "",
    })
  }
}

module.exports.authorization = async (req, res, next) => {
  const Account = getModel("Account")
  const token = getAccessToken(req)
  try {
    if (!token) {
      throw new Error("No token provided.")
    } else {
      await jwt.verify(token, SECRET_KEY_DEFAULT, async (err, decoded) => {
        if (err) {
          throw new Error("Something went wrong. Please sign in again.")
        }
        const { id: _id, is_admin, email, role, exp } = decoded
        if (exp * 1000 < Date.now()) throw new Error("Access token invalid a")
        const account = await Account.findOne({ _id, email })
          .select("-password")
          .lean()
        if (!account) throw new Error("Access token invalid")
        req.user = account
        next()
      })
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error.message || "",
    })
  }
}
