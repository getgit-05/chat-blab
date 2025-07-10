// Add process-level error handlers to prevent server crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express=require("express")

// Logging middleware to debug incoming requests
const logRequest = (req, res, next) => {
  console.log("Incoming request path:", req.path, "Original URL:", req.originalUrl);
  next();
};
// Add the logger as the very first middleware

const {io,server,app} =require("./services/socket")
app.use(logRequest)
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
    origin:"http://localhost:5173",
    credentials:true,

}))
app.use(express.urlencoded({limit: '10mb',extended:false}))
app.use(express.json({limit:"10mb"}))
app.use(cookieParser())




app.use("/api/auth",authRoute)
app.use("/api/messages",protect,messageRoute)
app.use("/api/follower",protect,followerRoute)

app.all('*', (req, res) => {
  res.status(404).send('Not found');
});

// Robust error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});


app.use(express.static(path.join(_dirname,"../frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(_dirname,"../frontend","dist","index.html"))
})


server.listen(port,()=>{
})

