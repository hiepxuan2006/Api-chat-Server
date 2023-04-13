const { getModel } = require("../connections/database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { uploadToCloudinary } = require("../middlewares/uploadCloud")
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const Account = getModel("Account")

module.exports.registerAccount = async (args = {}) => {
  const { name, password, email, phone = "0976567659", avatar } = args
  console.log(args)
  const hashedPass = await bcrypt.hashSync(password, salt)

  const oldAccount = await Account.findOne({ email }).lean()

  if (oldAccount) throw new Error("Tài khoản đã tồn tại !")

  const newAccount = new Account({
    name,
    email,
    avatar,
    password: hashedPass,
    phone,
  })
  // return newAccount
  return await newAccount.save()
}

module.exports.loginAccount = async (args = {}) => {
  const { email, password: pass } = args

  const account = await Account.findOne({ email })

  if (!account) throw new Error("Tài khoản chưa được đăng ký !")

  const validatorPassword = await bcrypt.compareSync(pass, account.password)
  if (!validatorPassword) throw new Error("Sai email hoặc mật khẩu !")

  const token = await jwt.sign(
    {
      id: account._id,
      email: account.email,
      role: account.roles,
      is_admin: account.is_admin,
    },
    "hiepxuan",
    {
      expiresIn: "1h",
    }
  )
  const { password, ...user } = account._doc
  return {
    user,
    access_token: token,
  }
}

module.exports.getAccount = async (args = {}) => {
  const { id } = args
  if (!id) throw new Error("Thiếu dữ liệu!")

  const account = await Account.findOne({ _id: id })

  const { password, ...profile } = account._doc

  return profile
}

module.exports.getAccountFriends = async (args = {}) => {
  const listFriends = await Account.findOne({ _id: id })
    .select("-password")
    .lean()

  return listFriends
}

module.exports.getAllAccount = async (args = {}) => {
  const { _id } = args
  let accounts = await Account.find().select("-password").lean()
  accounts = accounts.filter((item) => item._id.toString() !== _id.toString())

  return accounts
}
module.exports.authorization = async (args = {}) => {
  return args
}
module.exports.uploadCloud = async (args = {}) => {
  const { file, folder } = args

  const result = await uploadToCloudinary(file, folder)
  return result
}
