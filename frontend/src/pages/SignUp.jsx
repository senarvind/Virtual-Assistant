import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoIosEye, IoIosEyeOff} from "react-icons/io";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { userDataContext } from '../context/UserContext';

 const SignUp = () => {
  const [showpassword, setShowpasswrod] = useState(false)
 const { serverUrl, userData, setUserData } = useContext(userDataContext);
const navigate = useNavigate();
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [err, setErr] = useState("");

const handleSignUp = async(e)=>{
  e.preventDefault();
  setErr("")
  setLoading(true)
  try {
    let result = await axios.post(`http://localhost:8000/api/auth/signup`,{name, email, password}, {withCredentials:true});
  setUserData(result.data)
  setLoading(false)
  navigate("/")
  } catch (error) {
    console.log(error);
    setUserData(null)
    setLoading(false)
  }
} 

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage: `url(${bg})`}} >
  <form  onSubmit={handleSignUp}  className='w-[90%] h-[500px] max-w-[400px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] p-[20px]'>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>
         Vitual assistant </span></h1>
         <input type="text" value={name} placeholder='Enter your name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-50 p-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>{setName(e.target.value)}}/>
          <input type="text" value={email} placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-50 p-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>{setEmail(e.target.value)}}/>

    <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] shadow-none relative'>
<input type={showpassword ? 'text' : 'password'} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'  onChange={(e) => setPassword(e.target.value)}/>
{!showpassword && <IoIosEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] shadow-none cursor-pointer' onClick={()=> setShowpasswrod(true)}/>
 }
 {showpassword && <IoIosEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=> setShowpasswrod(false)}/>
 }
    </div>
  {err.length>0 && <p className='text-red-600 text-[17px]'> {err} </p>}
    <button className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full 'disabled={loading}> {loading ? "Loading..." : "Sign Up"}</button>

    <p className='text-white text-[18px] cursor-pointer' >Already have an account ? <span className='text-blue-400' onClick={()=>navigate("/signin")}>sign In</span></p>
      </form>
        </div> 
  )
}

export default SignUp