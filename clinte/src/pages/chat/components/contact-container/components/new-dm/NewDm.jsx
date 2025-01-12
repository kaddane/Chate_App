
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import Lottie from "react-lottie"
import { animationDefaultOption } from "../../../../../../lib/utils"
import { apiClient } from '../../../../../../lib/api-client'
import { SEARCH_CONTACTS_ROUTE } from "../../../../../../utils/constent"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "../../../../../../lib/utils"
import { HOST } from "../../../../../../utils/constent"
import {userAppStore} from "../../../../../../store/index"
// import { useNavigate } from 'react-router-dom'
// import { apiClient } from "../../../../../../lib/api-client"




function NewDm() {

    const [openNewContactModle, setOpenNewContactModle] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])
    const {setSelectedChatType, setSelectedChatData} = userAppStore()

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm }, { withCredentials: true })
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModle(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchedContacts([])
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus onClick={() => setOpenNewContactModle(true)} className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer duration-300 transition-all" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1a] text-white border-none p-2 mb-3">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModle} onOpenChange={setOpenNewContactModle}>
                <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div>
                            <Input onChange={ev => searchContacts(ev.target.value)} placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col">
                                {searchedContacts.map(con => (
                                    <dir key={con._id} onClick={() => selectNewContact(con)} className="flex gap-3 items-center cursor-pointer">
                                        <div className="w-12 h-12 relative">
                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                {con.image ? (
                                                    <AvatarImage src={`${HOST}/${con.image}`} alt="profile" className="object-cover w-full bg-black rounded-full" />
                                                ) : (
                                                    <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(con.color)}`}>
                                                        {
                                                            con.firstName ? con.firstName.split("").shift()
                                                            : con.email.split("").shift()
                                                        }
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>
                                                {con.firstName && con.lastName ? `${con.firstName} ${con.lastName}` : con.email}
                                            </span>
                                            <span className="text-xs">
                                                {con.email}
                                            </span>
                                        </div>
                                    </dir>
                                ))}
                            </div>
                        </ScrollArea>
                        {
                            searchedContacts.length <= 0 && (
                                <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all">
                                    <Lottie
                                        isClickToPauseDisabled={true}
                                        width={100}
                                        height={100}
                                        options={animationDefaultOption}
                                    />
                                    <div className="text-opacity-80 text-white flex flex-col items-center gap-5 mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                        <h3 className="poppins-medium">
                                            Hi<span className="text-purple-500">! </span>
                                            Search new
                                            <span className="text-purple-500"> Contacts </span>
                                        </h3>
                                    </div>
                                </div>
                            )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDm