const express=require("express")
const { getUserData,getMessages,sendMessage, deleteMessage,suggestUser } = require("../controllers/message.controller")
const router=express.Router()

router.get("/user",getUserData)
router.get("/user/:id",getMessages)
router.post("/:id",sendMessage)
router.get("/suggest",suggestUser)
router.delete('/delete/:id',deleteMessage)

module.exports=router