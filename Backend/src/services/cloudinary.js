const {config} =require("dotenv")
const {v2:cloudinary}=require("cloudinary")

config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET
})

module.exports= cloudinary