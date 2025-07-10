const express=require("express")
const { follow, getFollowerData, getRequests, deleteRequests, updateRequests, unfollow, followerCount } = require("../controllers/follower.controller")
const router=express.Router()

router.post("/follow/:id",follow)
router.get("/follow/:id",getFollowerData)
router.get("/requests",getRequests)
router.delete("/requests",deleteRequests)
router.put("/requests",updateRequests)
router.post("/unfollow/:id",unfollow)
router.get("/count/:id",followerCount)
module.exports=router