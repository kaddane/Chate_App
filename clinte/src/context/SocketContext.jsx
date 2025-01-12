
import { createContext, useContext, useEffect, useRef } from "react"
import { userAppStore } from "../store"

import { io } from "socket.io-client"
import { HOST } from "../utils/constent"

const SoketContext = createContext(null)


export const useSocket = () => {
    return useContext(SoketContext)
}


export const SocketProvider = ({children}) => {
    const socket = useRef()
    const { userInfo } = userAppStore()

    useEffect(() => {
        if(userInfo){
            socket.current = io(HOST, {
                withCredentials: true,
                query: {userId: userInfo.id},
            })
            socket.current.on("connect", () => {
                console.log("conected to secket server")
            })

            const handleReciveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = userAppStore.getState()

                if(selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipinent._id) ){
                    console.log("message rcv : ", message )
                    addMessage(message)
                }
            };
            

            socket.current.on("recieveMessage", handleReciveMessage)

            return () => {
                socket.current.disconnect()
            }
        }

    }, [userInfo])

    return (
        <SoketContext.Provider value={socket.current}>
            {children}
        </SoketContext.Provider>
    )

}





