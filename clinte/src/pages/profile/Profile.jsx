import { useNavigate } from "react-router-dom"
import { userAppStore } from "../../store"
import { useEffect, useRef, useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors, getColor } from "../../lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiClient } from '../../lib/api-client'
import { ADD_IMAGE_ROUTE, HOST, REMOVE_PROGILE_IMAGE_ROUTE, UPDATE_PROFOLE_INFO } from "../../utils/constent"





function Profile() {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = userAppStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
  },[userInfo])


  const validateProfile = async () => {
    if(!firstName){
      toast.error("Firstname is Required")
      return false
    }
    if(!lastName){
      toast.error("LastName is Required")
      return false
    }
    if(!selectedColor){
      toast.error("Color is Required")
      return false
    }
    return true
  }


  const seveChange = async () => {
    if(validateProfile()){
      try {
        const response = await apiClient.post(UPDATE_PROFOLE_INFO, {firstName, lastName, color:selectedColor}, {withCredentials: true})
        if(response.status === 200 && response.data){
          setUserInfo({...response.data})
          navigate('/chat')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handelNavegate = () =>  {
    if(userInfo.profileSetup){
      navigate("/chat")
    }else{
      toast.error("please setup profile.")
    }
  }

  const handelFileInputClick = () => {
    fileInputRef.current.click()
    console.log(Date.now())
  }

  const handelImgeChenge = async (event) => {
    const file = event.target.files[0]
    // console.log({file})
    if(file){
      const formData = new FormData()
      formData.append("profile-image", file)
      const response = await apiClient.post(ADD_IMAGE_ROUTE, formData, {withCredentials: true})
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image: response.data.image})
        toast.success("image updated successfully.")
      }
      // const reader = new FileReader()
      // reader.onload = () => {
      //   setImage(reader.result)
      // }
      // reader.readAsDataURL(file)
    }
  }
  const handelDeleteImge = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROGILE_IMAGE_ROUTE, {withCredentials: true})
      if(response.status === 200){
        setUserInfo({...userInfo, image: null})
        setImage(null)
        toast.success("remove image successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw md:w-max]">
        <div onClick={handelNavegate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 relative flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage src={image} alt="profile" className="object-cover w-full bg-black" />
              ) : (
                <div className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {
                    firstName ? firstName.split("").shift() 
                    : userInfo.email.split("").shift()                    
                  }
                </div>
              ) }
            </Avatar>
            {
              hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handelDeleteImge : handelFileInputClick}
                >
                  {image ? <FaTrash className="text-white text-3xl cursor-pointer" /> : <FaPlus className="text-white text-3xl cursor-pointer" />}
                </div>
              )
            }
            <input type="file" ref={fileInputRef} className="hidden" onChange={handelImgeChenge} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" />
          </div>

          <div className="flex min-w-32 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input type="email" palceholder="Email" disbaled  value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b]"/>
            </div>   
            <div className="w-full">
              <Input type="text" palceholder="First Name" onChange={(e) => setFirstName(e.target.value)} value={firstName} className="rounded-lg p-6 bg-[#2c2e3b]"/>
            </div>   
            <div className="w-full">
              <Input type="text" palceholder="Last Name" onChange={(e) => setLastName(e.target.value)} value={lastName} className="rounded-lg p-6 bg-[#2c2e3b]"/>
            </div>   
             
             <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div 
                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                ${
                  selectedColor === index
                  ? "outline outline-white/50 outline-2" 
                  : ""}
                  `}
                key={index}
                onClick={() => setSelectedColor(index)}
                ></div>
              ))}
             </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={seveChange} >Seve Change</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile