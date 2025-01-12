import { useNavigate } from "react-router-dom"
import { userAppStore } from "../../store"
import { useEffect } from "react"
import { toast } from "sonner"
import ContactContainer from "./components/contact-container/ContactContainer"
import EmptyChatContainer from "./components/empty-chat-container/EmptyChatContainer"
import CatContainer from "./components/chat-container/CatContainer"


const Chat = () => {

  const {userInfo, selectedChatType} = userAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("please setup profile to continue")
      navigate("/profile")
    }
  }, [userInfo, navigate])
  

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {
        selectedChatType === undefined ? (
          <EmptyChatContainer />
        ) : (
          <CatContainer />
        )
      }
    </div>
  )
}

export default Chat