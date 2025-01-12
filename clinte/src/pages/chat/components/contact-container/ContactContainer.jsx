import { useEffect } from "react"
import NewDm from "./components/new-dm/NewDm"
import ProfileInfo from "./components/profile-Info/ProfileInfo"
import { apiClient } from "../../../../lib/api-client"
import { GET_DM_CONTACTS_ROUTE } from "../../../../utils/constent"
import { userAppStore } from "../../../../store"
import ContactsList from "../../../../components/contacts-list"





function ContactContainer() {

  const {setDitectMessagesContacts, ditectMessagesContacts} = userAppStore()

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {withCredentials: true})
      if(response.data.contacts){
        setDitectMessagesContacts(response.data.contacts)
      }
    }

    getContacts()
  }, [])

  return (
    <div  className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
        <div className="pt-3 p-5">Chat App</div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text={"Direct Messanges"} />
            <NewDm />
          </div>
          <div className="max-h-[38vh] overflow-y-auto">
            <ContactsList contacts={ditectMessagesContacts} />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text={"Channels"} />
          </div>
        </div>

        <ProfileInfo />

    </div>
  )
}

export default ContactContainer

const Title = ({text}) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  )
}

// eslint.config.js  =>  rules =>  'react/prop-types': 'off',