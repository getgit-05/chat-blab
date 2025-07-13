import React from 'react'
import {Send,Image} from 'lucide-react'
import {useMessages} from '../store/chatStore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRef,useEffect } from 'react'
function Input() {


  const [preview,setPreview]=useState(null)
  const [text,setText]=useState("")

  const msg=useMessages()
  const fileRef=useRef(null)


  const handleSubmit=async (e)=>{
    e.preventDefault()
    try{
      if(!text && !preview) return
      setText("")
      setPreview(null)
      fileRef.current.value=""
      if(preview){
        await msg.postMessage({image:preview,text:null})
        setPreview(null)
        if(fileRef.current) fileRef.current.value=""
        return
      }
      await msg.postMessage({text:text,image:null})
      
    }catch(error){
      console.log("Send File Error :-",error)
      toast.error("An Error Occured")
    }
  }

  const handleImage=(e)=>{
    const file=e.target.files[0]
    if(!file.type.startsWith("image/")){
      toast.error("Please Select An Image")
      return
    }

    const reader=new FileReader()
    reader.onloadend=()=>{
    setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const canclePreview=()=>{
    setPreview(null)
    if(fileRef.current) fileRef.current.value=""
  }

  return (
    <div className="w-full">
          
  {preview && <div className="avatar position absolute bottom-5">
    <div className="indicator absolute right-[-5%] top-[-4%] border-1 rounded-full h-3 w-3">
            <button className='bg-base-300 h-6 w-3 border-0' onClick={canclePreview}></button>
          </div>
  <div className="w-24 rounded">
    <img src={preview}/>
  </div>
</div>}
    <div className="w-full flex gap-2.5 items-center">
      <form onSubmit={handleSubmit} className='w-full flex gap-2.5 items-center'>
        <input value={text} onChange={(e)=>setText(e.target.value)} type="text" placeholder="Type here" className="input md:w-full" />
        <label>
          <input ref={fileRef} accept="image/*" onChange={handleImage} type="file" className="hidden"/>
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${preview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </label>
      <button type="submit"><Send/></button>
      </form>
      
    </div>
    </div>
  )
}

export default Input
