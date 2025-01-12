import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { apiClient } from '../../lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constent'
import { useNavigate } from 'react-router-dom'
import { userAppStore } from '../../store'






const Auth = () => {
  
  const navigat = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confermPassword, setConfermPassword] = useState("")
  const {setUserInfo} = userAppStore()

  const validateSingUp = () => {
    if(!email.length){
      toast.error("Email is Required")
      return false
    }
    if(!password.length){
      toast.error("password is Required")
      return false
    }
    if(password != confermPassword){
      toast.error("password and conferm passwsord should be same")
      return false
    }
    return true
  }

  const validateLogin = () => {
    if(!email.length){
      toast.error("Email is Required")
      return false
    }
    if(!password.length){
      toast.error("password is Required")
      return false
    }
    return true
  }

  const handelLogin = async () => {
    if(validateLogin()){
      const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials: true})
      if(response.data.user.id){
        setUserInfo(response.data.user)
        if(response.data.user.profileSetup) navigat("/chat");
        else   navigat("/profile")
      }
    }
  }

  const handelSignUp = async () => {
    if(validateSingUp()){
      const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, {withCredentials: true})
      if(response.status === 201){
        setUserInfo(response.data.user)
        navigat("/profile")
      }
    }
  }

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
      <div className='h-[90vh] w-[80vw] shadow-2xl border-white border-2 text-opacity-90 md:w-[90vw] lg:w-[70vw] xl:w-[60vw] xl:grid-cols-2'>
        <div className='flex flex-col gap-10 justify-center items-center'>
          <div className='flex items-center justify-center flex-col gap-2'>
            <h1 className='text-5xl font-bold md:text-6xl'>Welcom</h1>
            <p className='font-medium text-center'>Fill in details to Login</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs defaultValue="login" className='w-3/4'>
              <TabsList className='w-full bg-transparent rounded-none'>
                <TabsTrigger value="login" className='w-full data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-black text-opacity-90 rounded-none border-b-2 data-[state=active]:border-b-purple-500'>Login</TabsTrigger>
                <TabsTrigger value="register" className='w-full data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-black text-opacity-90 rounded-none border-b-2 data-[state=active]:border-b-purple-500'>Singup</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className='flex flex-col gap-5 mt-10'>
                <Input type='email' className='rounded-full p-6' placeholder='Email' onChange={ev => setEmail(ev.target.value)} />
                <Input type='password' className='rounded-full p-6' placeholder='Password' onChange={ev => setPassword(ev.target.value)} />
                <Button className='rounded-full p-6' onClick={handelLogin}>Button</Button>
              </TabsContent>
              <TabsContent value="register" className='flex flex-col gap-5'>
                
              <Input type='Email' className='rounded-full p-6' placeholder='Email' onChange={ev => setEmail(ev.target.value)} />
                <Input type='password' className='rounded-full p-6' placeholder='Password' onChange={ev => setPassword(ev.target.value)} /> 
                <Input type='password' className='rounded-full p-6' placeholder='Conferm Password' onChange={ev => setConfermPassword(ev.target.value)} /> 
                <Button className='rounded-full p-6' onClick={handelSignUp}>Button</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth