import React, { useEffect, useMemo, useState } from "react";
import { useMessages } from "../store/chatStore";
import Chat from "../components/chatCntainer";
import Image from "../components/chatImage";
import {protectContext} from "../store/authStoree"
import { useContext } from "react";
import { useFollower } from "../store/followerStore";
import socket from "../Services/socket";


function Home(prop) {

  const protect=useContext(protectContext)
  const data = useMessages();
  const [hasNotified,setHasNotified]=useState(false)
  const follow=useFollower()
  const [showChatMobile, setShowChatMobile] = useState(false); // new state


  useEffect(() => {
    data.getUser();
  }, []);
  useEffect(() => {
    follow.getRequests()  
  }, []);


  useEffect(() => {
    data.getUser();
  }, [data?.users]);

   useEffect(()=>{
    if (protect.data?.data?._id) {
      follow.getRequests().then(() => {
        if (follow.requests?.data?.length > 0 && !hasNotified) {
          prop.dot(true)
       
          setHasNotified(true)
        }
      })
    }
  },[protect.data?.data?._id,hasNotified,follow.requests])
  
   useEffect(()=>{
    if (protect.data?.data?._id) {
      follow.getRequests().then(() => {
        if (follow.requests?.data?.length > 0) {
          prop.dot(true)
        }
      })
    }
  },[])

  useEffect(()=>{
    data.updateMessage(data.selectUser?._id)
    data.delMessage(data.selectUser?._id)
    return () => {
      data.stopUpdateMessage()
      data.stopDelMessage()
    }
  },[data.selectUser])

  const handleClick=(userId)=>{
    data.setSelectUser(userId)
    // On mobile, show chat container
    if (window.innerWidth < 768) setShowChatMobile(true);
  }

  let user = data?.users?.data;

  return (
    <div className="flex h-screen min-w-full bg-black md:gap-2 md:p-2 gap-0 p-0">

      <div
        className={
          `w-full h-full mt-2.5 rounded-2xl bg-[#181A20] shadow-2xl md:w-[25%] sm:w-[35%] p-0 m-0 flex flex-col ` +
          (showChatMobile ? 'hidden' : 'block') +
          ' md:block'
        }
      >
        <h1 className="text-white text-2xl font-bold ml-6 mt-6 mb-6 tracking-tight">Chats</h1>
        <div className="overflow-auto h-[84vh] p-0 m-0 flex-1">
          <ul
            id="chatsec"
            className="list bg-transparent overflow-hidden p-0 m-0 flex flex-col gap-3"
          >
            {user
              ? user.map((fr) => (
                  <li key={fr._id} className={`transition-all duration-200 ${data?.selectUser?._id==fr._id?"border-2 border-blue-500 bg-[#23263a] scale-[1.01] shadow-lg":"hover:bg-[#23263a]/80"} w-full border-0 p-0 m-0 rounded-xl relative`}>    
                    <button
                      className={`group relative w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none ${data?.selectUser?._id==fr._id?"bg-[#23263a]":"bg-[#1a1c23]"}`}
                      onClick={()=>handleClick(fr)}
                    >
                      <img
                        className="size-14 rounded-full border-2 border-[#23263a] shadow object-cover bg-gray-800"
                        src={fr.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"}
                        alt={fr.name}
                      />
                      <div className="flex-1 flex flex-col items-start ml-2 min-w-0">
                        <div className="truncate text-base font-semibold text-white mb-1">{fr.name}</div>
                        <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-xs font-medium ${prop.data.includes(fr._id)?"bg-green-600/80 text-white":"bg-gray-600/80 text-gray-200"}`}>{prop.data.includes(`${fr._id}`)?"Online":"Offline"}</span>
                      </div>
                      <div className="absolute bottom-3 right-5 text-xs text-gray-400 bg-[#23263a] px-2 py-0.5 rounded font-semibold shadow border border-[#23263a]">
                        {new Date(fr.lastMessageAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",hour12:false})}
                      </div>
                    </button>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      <div
        className={
          // Hide chat container on mobile unless showChatMobile is true
          `w-full h-full border-2 border-black mt-2.5 rounded bg-black md:w-[75%] sm:w-[65%] ` +
          (showChatMobile ? 'block' : 'hidden') +
          ' md:block'
        }
      >
       
        {showChatMobile && (
          <button
            className="md:hidden text-white px-4 py-2 mb-2 bg-gray-800 rounded shadow"
            onClick={() => setShowChatMobile(false)}
          >
            ←
          </button>
        )}
        {data.selectUser?<Chat user={data.selectUser}/>:<Image/>}
      </div>
    </div>
  );
}

export default Home;
