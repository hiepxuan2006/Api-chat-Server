const { getModel } = require("../connections/database")

const Account = getModel("Account")

module.exports.searchAccount = async (args = {}) => {
  const { limit, page, q } = args
  const skip = (page - 1) * limit
  const name = {
    $regex: new RegExp(q, "gi"),
  }

  const _accounts = Account.find({ name })
    .limit(limit)
    .select("-password")
    .skip(skip)
    .lean()
  const _total = Account.countDocuments({ name })

  const [accounts, total] = await Promise.all([_accounts, _total])
  const pages = Math.floor(total / limit)

  return { accounts, limit, page, pages }
}
