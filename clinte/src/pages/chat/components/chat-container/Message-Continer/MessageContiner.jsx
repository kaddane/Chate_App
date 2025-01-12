import { useEffect, useRef, useState } from "react"
import { userAppStore } from "../../../../../store"
import moment from "moment"
import { apiClient } from "../../../../../lib/api-client"
import { GET_ALL_MESSAGES_ROUTE, HOST } from "../../../../../utils/constent"

import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
 
function MessageContiner() {

  const scrollRef = useRef()
  const { selectedChatType, selectedChatData, selectedCateMessage, setSelectedCateMessage } = userAppStore()
  const [showImage, setShowImage] = useState(false)
  const [imageURL, setImageURL] = useState(null)


  useEffect(()=>{

    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {id: selectedChatData._id}, {withCredentials: true} )

        if(response.data.messages) {
          setSelectedCateMessage(response.data.messages)
        }
      } catch (error) {
        console.log({error})
      }
    }

    if(selectedChatData._id){
      if(selectedChatType === "contact") getMessages();
    };
  }, [selectedChatData, selectedChatType, setSelectedCateMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedCateMessage])

  const checkIfImage = (imagePath) => {
    const imageRegex = /\.(jpg|jpeg|jfif|pjpeg|png|svg|pjp|webp|gif|icon|tiff|heif)$/i
    return imageRegex.test(imagePath)
  }

  const renderMessage = () => {
    let lastDate = null;
    return selectedCateMessage.map((message, index) => {
      const messageDate = moment(message.timesTamp).format("YYYY-MM-DD")
      const showData = messageDate !== lastDate
      lastDate = messageDate
      return (
        <div key={index}>
          {
            showData && (
              <div className="text-center text-gray-500 my-2">
                {moment(message.timesTamp).format("LL")}
              </div>
            )
          }
          {
            selectedChatType === "contact" && renderDMMessages(message)
          }
        </div>
      )
    })
  }

  const downloadFile = async (url) => {
    const response = await apiClient.get(`${HOST}/${url}`,
       {responseType: 'blob'})
    
    const URLBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = URLBlob
    link.setAttribute("download", url.split("/").pop())
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.revokeObjectURL(URLBlob)
  }

  const renderDMMessages = (message) => {
    return (
      <div className={`
        ${message.sender === selectedChatData._id ? "text-left" : "text-right"}`
      }>
        {
          message.messageType === "text" && (
            <div className={
              `${message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} 
                border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={
              `${message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} 
                border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
              {checkIfImage(message.fileUrl) 
              ? <div className="cursor-pointer"
                onClick={() => {
                  setShowImage(true)
                  setImageURL(message.fileUrl)
                }}
                >
                <img src={`${HOST}/${message.fileUrl}`} width={300} height={300} alt="" />
              </div> 
              : <div className="flex justify-center items-center gap-4">
                <div className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </div>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown /> 
                </span>
              </div> }
            </div>
          )
        }
        <div className="text-xs text-gray-600">
          {moment(message.timesTamp).format("LT")}
        </div>
      </div>
    )
  }



  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef} />
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
          <div>
            <img src={`${HOST}/${imageURL}`} className="h-[80vh] w-full bg-cover" />
          </div>
          <div className="flex gap-5 fixed mt-5 top-0">
          <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
          onClick={() => downloadFile(imageURL)}
          >
            <IoMdArrowRoundDown />
          </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContiner