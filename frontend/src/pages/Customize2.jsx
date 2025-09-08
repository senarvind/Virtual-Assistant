import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {
  const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () =>{
      try {
        let formData = new FormData()
        formData.append("assistantName", assistantName);
        
        if(backendImage){
          formData.append("assistantImage", backendImage);
        }
        else{
          formData.append("imageUrl", selectedImage);
        }
        const result = await axios.post(`https://virtual-assistant-backend-zv2l.onrender.com/api/user/update`, formData, {withCredentials:true})
        console.log(result.data);
        setUserData(result.data);
        navigate("/")
      } catch (error) {
        console.log(error);
      }
    }
  return (
<div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>

<MdOutlineKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=> navigate("/customize")}/>

 <h1 className='text-white text-[30px] text-center mb-[40px]'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>
  <input type="text"  value={assistantName} placeholder='eg.shifra' className='w-full max-w-[600px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-50 p-[20px] py-[10px] rounded-full text-[18px]' onChange={(e)=> setAssistantName(e.target.value)}/>
{assistantName && <button className='min-w-[300px] mt-[30px] h-[60px] bg-white rounded-full cursor-pointer' disabled={loading} onClick={()=>{
  handleUpdateAssistant()
  }}>{!loading ? "Finally Create Your Assistant" : "Loading..."}</button>}
  
</div>
  )
}

export default Customize2
