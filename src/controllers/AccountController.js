const Joi = require("joi")
const AccountActions = require("../actions/AccountAction")
const { sendSuccess, sendError } = require("../helpers/response")
module.exports.searchAccount = async (req, res) => {
  try {
    const { body } = req
    const validator = Joi.object({
      q: Joi.string().trim(),
      limit: Joi.number().integer().default(10).max(100),
      page: Joi.number().integer().default(1),
    }).options({ stripUnknown: true })
    const validated = await validator.validateAsync(body)
    AccountActions.searchAccount(validated)
      .then(sendSuccess(req, res))
      .catch(sendError(req, res))
  } catch (error) {
    sendError(req, res)
  }
}
