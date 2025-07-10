const {Router}=require("express");
const router=Router()
const { signin, login, upload, logout,check,getUser, updateBio, searchUser } = require("../controllers/auth.controller");
const { protect } = require("../middleware/protect");

router.post("/signin",signin)
router.post("/login",login)
router.post("/logout",logout)
router.post("/bio",protect,updateBio)


router.put("/update-photo",protect,upload)


router.get("/check",protect,check)
router.get("/:id",protect,getUser)
router.get("/user/data",protect,searchUser)

module.exports=router
