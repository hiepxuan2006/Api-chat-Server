const Joi = require("joi")
const AuthAction = require("../actions/AuthAction")
const { sendSuccess, sendError } = require("../helpers/response")

module.exports.registerAccount = async (req, res) => {
  try {
    const { body } = req
    const validator = Joi.object({
      name: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống tên`,
      }),
      email: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống email`,
      }),
      phone: Joi.number().integer().messages({
        "string.length": "Nhập đúng số điện thoại",
        "string.empty": `Không được để trống số điện thoại`,
      }),
      password: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống mật khẩu`,
      }),
      avatar: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống anhr!`,
      }),
    }).options({ stripUnknown: true })
    const validated = await validator.validateAsync(body)
    AuthAction.registerAccount(validated)
      .then(sendSuccess(req, res))
      .catch(sendError(req, res))
  } catch (error) {
    sendError(req, res)(error)
  }
}

module.exports.loginAccount = async (req, res) => {
  try {
    const { body } = req
    const validator = Joi.object({
      email: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống email`,
      }),
      password: Joi.string().trim().required().messages({
        "string.empty": `Không được để trống mật khẩu`,
      }),
    }).options({ stripUnknown: true })
    const validated = await validator.validateAsync(body)
    AuthAction.loginAccount(validated)
      .then(sendSuccess(req, res))
      .catch(sendError(req, res))
  } catch (error) {
    sendError(req, res)(error)
  }
}

module.exports.getAccount = (req, res) => {
  const { body } = req
  AuthAction.getAccount(body)
    .then(sendSuccess(req, res))
    .catch(sendError(req, res))
}

module.exports.getAllAccount = (req, res) => {
  const { user } = req
  AuthAction.getAllAccount(user)
    .then(sendSuccess(req, res))
    .catch(sendError(req, res))
}

module.exports.authorization = (req, res) => {
  const { user } = req
  AuthAction.authorization(user)
    .then(sendSuccess(req, res))
    .catch(sendError(req, res))
}

module.exports.uploadCloud = (req, res) => {
  const { file } = req
  const { folder } = req.body
  AuthAction.uploadCloud({ file, folder })
    .then(sendSuccess(req, res))
    .catch(sendError(req, res))
}
