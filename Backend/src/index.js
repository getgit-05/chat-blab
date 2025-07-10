const express=require("express")
const {io,server,app} =require("./services/socket")
const authRoute=require("./routes/auth")
const messageRoute=require("./routes/message.routes")
const followerRoute=require('./routes/follower.route')
const connectDb = require("./services/connection")
const cookieParser=require("cookie-parser")
const dotenv=require("dotenv")
const cors=require("cors")
const path=require("path")
const { protect } = require("./middleware/protect")
dotenv.config()

const _dirname=path.resolve()




const port=process.env.PORT || 8000

connectDb(process.env.MONGODB_URL)

app.use(cors({
    origin:"https://chat-blab.onrender.com",
    credentials:true,

}))
app.use(express.urlencoded({limit: '10mb',extended:false}))
app.use(express.json({limit:"10mb"}))
app.use(cookieParser())




app.use("/api/auth",authRoute)
app.use("/api/messages",protect,messageRoute)
app.use("/api/follower",protect,followerRoute)


app.use(express.static(path.join(_dirname,"../frontend/dist")))

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
});


server.listen(port,()=>{
})

