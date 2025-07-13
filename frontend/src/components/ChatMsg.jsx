import React, { useEffect, useState, useRef, useContext } from 'react'
import { useMessages } from "../store/chatStore"
import { DeleteIcon } from 'lucide-react'
import { protectContext } from '../store/authStoree'

function ChatMsg(prop) {
  const dataa = useMessages()
  const msg = prop.msgg || []
  const messageRef = useRef(null)
  const mess= useMessages()
  const protect=useContext(protectContext)
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null,senderId:null })
  const [seen,setSeen]=useState(false)
  useEffect(()=>{
    setSeen(true)
  },[])
  useEffect(() => {
    if (messageRef.current && msg)
      messageRef.current.scrollIntoView({ behavior: seen ? "smooth" :"auto" })
  }, [msg])

  useEffect(() => {
    const handleClick = () => setMenu(m => ({ ...m, visible: false }))
    if (menu.visible) {
      window.addEventListener('click', handleClick)
      return () => window.removeEventListener('click', handleClick)
    }
  }, [menu.visible])


  const handleContextMenu = (e, messageId,senderId) => {
    e.preventDefault()
    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageId,
      senderId,
    })
  }
    const handleDeleteMessage =async (id) => {
    setMenu(m => ({ ...m, visible: false }))
    if(id)
      {await mess.deleteMessage(id)
      const newData=mess.msgData.filter(messa=>messa._id!==id)
      mess.setMsgData(newData)
  }
  }

  return (
    <div>
      {dataa.msgLoad ? (
        <div className="w-full h-[80vh] pt-2 pl-1 pr-1 overflow-auto"></div>
      ) : (

        
        <div className={`w-full h-[80vh] pt-2 pl-1 pr-1 overflow-auto relative`}>
          
          {msg?.map((message) => (
            
            <div
              key={message._id}
              ref={messageRef}
              onContextMenu={e => handleContextMenu(e, message._id,message.senderId._id)}
              className={`chat ${dataa.selectUser._id === message.recieverId ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={message.senderId?.profileImageUrl || "https://res.cloudinary.com/du9bkkccq/image/upload/v1752337424/t58jiptx00gqj34a8eh8.svg"}
                  />
                </div>
              </div>
              <div className="chat-header">
                <time className="text-xs opacity-50">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
              {message.text ? (
                <div className={`relative flex chat-bubble`}>{message.text}</div>
              ) : (
                <div className="chat-bubble">
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                </div>
              )}
            </div>
          ))}
          {menu.visible && menu.senderId!==dataa.selectUser._id?
             <div
              className="fixed z-50 bg-white shadow-xl rounded-lg p-2 min-w-[120px] border border-gray-200"
              style={{ top: menu.y, left: menu.x }}
              onClick={e => e.stopPropagation()}
            >
             <button
                className="flex items-center gap-2 w-full px-2 py-1 text-red-600 hover:bg-gray-100 rounded"
                onClick={() => handleDeleteMessage(menu.messageId)}
              >
                <DeleteIcon className="w-4 h-4" /> Delete
              </button>
              
            </div>
          :null}

          {mess.isSending && (
            <div className={`chat ${dataa.selectUser._id === dataa.selectUser._id ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={protect?.data?.data?.profileImageUrl || "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"}
                  />
                </div>
              </div>
              <div className="chat-header">
                <time className="text-xs opacity-50">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
              <div className="chat-bubble flex items-center gap-2">
                <span>Sending...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatMsg
