const fs = require("fs")
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "dfmnriiwu",
  api_key: "183145767373534",
  api_secret: "LwRQJY7FrZPurt5ElL4nvoJuAok",
})

module.exports.uploadToCloudinary = async (file, folder = "media") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
    })
    fs.unlinkSync(file.path) // xóa file trên server
    return result
  } catch (error) {
    console.log(error)
    throw new Error("Could not upload file to Cloudinary")
  }
}

module.exports.uploadMultiToCloudinary = async (files, folder = "media") => {
  try {
    const uploaded = []
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
      })
      fs.unlink(file.path, (error) => {
        if (error) {
          console.log(error)
        }
      }) // xóa file trên server
      uploaded.push(result)
    }
    return uploaded
  } catch (error) {
    console.log(error)
    throw new Error("Could not upload files to Cloudinary")
  }
}
