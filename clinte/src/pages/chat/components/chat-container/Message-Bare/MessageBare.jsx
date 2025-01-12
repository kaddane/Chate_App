
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from "react-icons/io5"
import  EmojiPicker  from "emoji-picker-react"
import { userAppStore } from "../../../../../store/index"
import { useSocket } from "../../../../../context/SocketContext"
import { apiClient } from "../../../../../lib/api-client"
import { UPLOAD_FILE_ROUTE } from "../../../../../utils/constent"

function MessageBare() {

  
  const emojiRef = useRef()
  const fileInputRef = useRef()
  const { selectedChatType, selectedChatData, userInfo } = userAppStore()
  const socket = useSocket()
  const [message, setMessage] = useState("")
  const [emojiPikerOpen, setEmojiPikerOpen] = useState(false)

  useEffect(()=> {
    function handleClickOutSide(event) {
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPikerOpen(false)
      }      
    }
    document.addEventListener("mousedown", handleClickOutSide)
    return () => {
      document.addEventListener("mousedown", handleClickOutSide)
    }
  }, [emojiRef])

  const handleAttachmentClick =  () => {
    if(fileInputRef.current){
      fileInputRef.current.click()
    }
  }

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if(selectedChatType === "contact"){
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipinent: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    }
  } 

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0]
      if(file){
        console.log(file)
        const formData = new FormData()
        formData.append("file", file)
        console.log(formData)
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {withCredentials: true})

        if(response.status === 200 && response.data){
          if(selectedChatType === "contact"){
              socket.emit("sendMessage", {
                sender: userInfo.id,
                content: undefined,
                recipinent: selectedChatData._id,
                messageType: "file",
                fileUrl: response.data.filePath,
              })
          }
        }
      }
      
    } catch (error) {
      console.log({error})
    }
  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input type="text" value={message} onChange={ev => setMessage(ev.target.value)} className="flex-1 p-5 bg-transparent rounded-md focus:outline-none focus:border-none" placeholder="Enter Message" />
        <button onClick={handleAttachmentClick} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all ">
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button onClick={() => setEmojiPikerOpen(true)} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all ">
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark" 
            open={emojiPikerOpen} 
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button onClick={handleSendMessage} className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741dba] focus:bg-[#741dba] focus:text-white focus:outline-none duration-300">
        <IoSend className="text-2xl" />
      </button>
    </div>
  )
}

export default MessageBare