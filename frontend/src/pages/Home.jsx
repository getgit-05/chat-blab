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


  useEffect(() => {
    data.getUser();
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
  }

  let user = data?.users?.data;

  return (
    <div className="h-screen w-full bg-black p-2 flex gap-2">
      <div
        
        className="h-179  mt-2.5 rounded bg-base-300 md:w-[25%] sm:w-[35%] "
      >
        <h1 className="text-white text-2xl ml-2.5 mt-2 mb-3">Chats</h1>
        <div className="overflow-auto h-[84vh]">
          <ul
            id="chatsec"
            className="list bg-base-100 overflow-hidden scroll-m-6 shadow-md"
          >
            {user
              ? user.map((fr) => (
                  <li key={fr._id} className={`${data?.selectUser?._id==fr._id?"bg-base-300":""} list-row border-0 p-0  sm:rounded-b-none sm:rounded-t-none hover:bg-base-300`}>
    
                    <button className={`${data?.selectUser?._id==fr._id?"bg-base-300":""} relative pt-2 pl-1 w-[300px] h-[80px] flex gap-2.5`} onClick={()=>handleClick(fr)}
                      >
                    <div>
                      <img
                        className="size-14 rounded-full"
                        src={
                          fr.profileImageUrl ||
                          "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        }
                      />
                    </div>
                    <div className="mr-[32px]">
                      <div>{fr.name}</div>
                      <div className={`flex items-center ${prop.data.includes(fr._id)?"text-green-500":"text-white"} `} >{prop.data.includes(`${fr._id}`)?"Online":"Offline"}</div>
                    </div>
                    <div className="self-star absolute right-[1%] text-[12px]">{new Date(fr.lastMessageAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:false})}</div>
                    </button>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      <div className="h-170 border-2 border-black mt-2.5 rounded bg-black md:w-[75%] sm:w-[65%]">

        {data.selectUser?<Chat user={data.selectUser}/>:<Image/>}
      </div>
    </div>
  );
}

export default Home;
