// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Auth from './pages/auth/auth'
import Chat from './pages/chat/chat'
import Profile from './pages/profile/Profile'
import { userAppStore } from './store'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constent'

const PriveteRoute = ({children}) => {
  const {userInfo} = userAppStore()
  const isAuthenticated = !!userInfo    // not undefined
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({children}) => {
  const {userInfo} = userAppStore()
  const isAuthenticated = !!userInfo    // not undefined
  return isAuthenticated ? <Navigate to="/chat" /> : children
}


function App() {

  const {userInfo, setUserInfo} = userAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try{
        const response = await apiClient(GET_USER_INFO, {withCredentials: true}) 
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
        console.log({response})
      }catch(error) {
        setUserInfo(undefined)
        console.log({error})
      }finally {
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }else{
      setLoading(false)
    }

    
  }, [setUserInfo, userInfo])

  if(loading){
    return <div>loading....</div>
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={
            <AuthRoute> 
              <Auth />
            </AuthRoute>} 
          />

          <Route path='/chat' element={
            <PriveteRoute>
              <Chat />
            </PriveteRoute>
          } />
          <Route path='/profile' element={
            <PriveteRoute>
              <Profile />
            </PriveteRoute>} />
          <Route path='/*' element={<Navigate to={'/auth'} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
