import React, { createContext, useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
export const userDataContext = createContext()

const UserContext = ({children}) => {
    const serverUrl = "http://localhost:8000"
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);


    const handleCurrentUser = async () =>{
      try {
    const result = await axios.get(`http://localhost:8000/api/user/current`, {withCredentials:true})
    console.log(result);
    setUserData(result.data);

      } catch (error) {
        console.log(error);
        
      }
    }

    const getGeminiResponse = async (command)=>{
       try {
        const result = await axios.post(`http://localhost:8000/api/user/asktoassistant`,{command},{withCredentials:true})
        return result.data

       } catch (error) {
        console.log(error)
       }
    }

    useEffect(()=>{
 handleCurrentUser();
    }, [])

    const value = {
     serverUrl,
     userData, 
     setUserData,
     frontendImage, 
     setFrontendImage,
     backendImage, 
     setBackendImage,
     selectedImage, 
     setSelectedImage,
     getGeminiResponse
    }
    
  return (
    <div> 
        <userDataContext.Provider value={value}>
         {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext