import React, { useState,useEffect, useContext } from 'react'
import {useMessages} from '../store/chatStore'
import ChatMsg from './ChatMsg'
import Input from './Input'
import { protectContext } from '../store/authStoree'
import { Navigate, useNavigate } from 'react-router-dom'
function Chat(prop) {

    const protect=useContext(protectContext)
    const msg=useMessages()
    const navigate=useNavigate()

    useEffect(()=>{
        msg.getMessages(msg.selectUser._id)
    },[msg.selectUser._id,msg.setMsgData])


    const visiteUser=(e,id)=>{
      e.preventDefault()
      protect.loadUser(id)
      navigate(`/user/${id}`)
    }

  return (
    <div className="bg-base-300 h-full">
        <div className="user">
            <div className="navbar bg-neutral text-neutral-content">
                <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={prop.user.profileImageUrl}/>
                </div>
                </div>

                <div onClick={(e)=>visiteUser(e,prop.user._id)} className="btn border-0 hover:bg-neutral hover:border-0 btn-ghost text-xl">{prop.user.name}</div>
            </div>

        </div>
        <div className="message">
            {msg.msgLoad?<div className="w-full h-[72vh]">
                <div className="flex w-full flex-col gap-4">
  <div className="skeleton h-32 w-full"></div>
  <div className="skeleton h-4 w-28"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
</div></div>:<div><ChatMsg msgg={msg.msgData}/></div>}
        </div>
      <div className=" flex justify-center pt-5 pr-5 pb-3 pl-7"><Input/></div>
    </div>
  )
}

export default Chat
