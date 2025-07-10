const {Server} = require("socket.io")
const http =require('http')

const express=require("express")

const app=express()

const server=http.createServer(app)

const onlineUserMap={}

const getOnlineUser=(userId)=>{
    return onlineUserMap[userId]
}


const io=new Server(server,{
    cors:{
        origin:["https://chat-blab.onrender.com"],
    }
})

io.on("connection",(socket)=>{
    const userId=socket.handshake.auth.id;
    if(userId) onlineUserMap[userId]=socket.id;


    io.emit("getOnlineUsers",Object.keys(onlineUserMap))
    socket.on("disconnect",()=>{
    delete onlineUserMap[userId]
     io.emit("getOnlineUsers",Object.keys(onlineUserMap))

})
})


module.exports={io,app,server,getOnlineUser}

