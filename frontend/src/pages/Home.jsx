import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { useState } from 'react';
import { FiMenu} from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { useRef } from 'react';

const Home = () => {
  const {userData, setUserData, getGeminiResponse, serverUrl} = useContext(userDataContext);
  const navigate = useNavigate();
  const[listening, setListening] = useState(false)
  const[userText, setUserText] = useState("")
  const[aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  
const handleLogout = async () =>{
  try {
    const result = await axios.get(`https://virtual-assistant-backend-zv2l.onrender.com/api/auth/logout`, {withCredentials:true})
    setUserData(null) 
    navigate("/signin")
  return result 
  } catch (error) {
    setUserData(null) 
    console.log(error)
  }
}

const startRecognition = () =>{
  if(!isSpeakingRef.current && !isRecognizingRef.current){
    try {
      recognitionRef.current?.start();
      console.log("Recognition start");
    } catch (error) {
      if(error.name !== "InvalidStateError"){
        console.log("Start error :", error);
      }
    }
  }
}

const speak = (text) =>{
  const utterence = new SpeechSynthesisUtterance(text);
  utterence.lang = 'hi-IN';
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang === 'hi-IN');
  if(hindiVoice){
    utterence.voice = hindiVoice;
  }
  
  isSpeakingRef.current = true;
  utterence.onend = ()=>{
    setAiText("")
    isSpeakingRef.current = false;
    setTimeout(()=>{
      startRecognition(); 
    }, 800);
  }
  synth.cancel();
  synth.speak(utterence);
}

const handleCommand = (data) => {
  const { type, userInput, response } = data;

  // बोलना (speech)
  speak(response);

  // Google search
  if (type === "google-search") {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  }

  // Calculator
  if (type === "calculator-open") {
    window.open(`https://www.google.com/search?q=calculator`, "_blank");
  }

  // Instagram
  if (type === "instagram-open") {
    window.open(`https://www.instagram.com/`, "_blank");
  }

  // LinkedIn
  if (type === "linkedin-open") {
    window.open(`https://www.linkedin.com/`, "_blank");
  }

  // Facebook
  if (type === "facebook-open") {
    window.open(`https://www.facebook.com/`, "_blank");
  }

  // Twitter (X)
  if (type === "twitter-open") {
    window.open(`https://twitter.com/`, "_blank");
  }

  // WhatsApp Web
  if (type === "whatsapp-open") {
    window.open(`https://web.whatsapp.com/`, "_blank");
  }

  // GitHub
  if (type === "github-open") {
    window.open(`https://github.com/`, "_blank");
  }

  // Gmail
  if (type === "gmail-open") {
    window.open(`https://mail.google.com/`, "_blank");
  }

  // Weather
  if (type === "weather-show") {
    window.open(`https://www.google.com/search?q=weather`, "_blank");
  }

  // YouTube search / play
  if (type === "youtube-search" || type === "youtube-play") {
    const query = encodeURIComponent(response);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  }
};



useEffect(()=>{
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true,
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

   let isMounted = true;

   const startTimeOut = setTimeout(()=>{
    if(isMounted && !isSpeakingRef.current  && !isRecognizingRef.current){
     try {
      recognition.start();
      console.log("Recognition is start");
     } catch (error) {
      if(error.name !== "InvalidStateError"){
        console.log(error);
      }
     }
    }
   }, 1000);
  
  recognition.onstart = () =>{
     console.log("Recognition start");
     isRecognizingRef.current = true;
     setListening(true);
  }

  recognition.onend = () =>{
     console.log("Recognition ended");
     isRecognizingRef.current = false;
     setListening(false);

    if(isMounted && !isSpeakingRef.current){
      setTimeout(()=>{
        if(isMounted){
          try {
            recognition.start();
            console.log("Recognition restarted")
          } catch (error) {
             if(error.name !== "InvalidStateError"){
        console.log(error);
      }
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) =>{
   console.warn("Recognition error :", event.error);
   isRecognizingRef.current = false;
   setListening(false);
   if(event.error !== "aborted" && isMounted && !isSpeakingRef.current){
     setTimeout(()=>{
        if(isMounted){
          try {
            recognition.start();
            console.log("Recognition restarted")
          } catch (error) {
             if(error.name !== "InvalidStateError"){
        console.log(error);
      }
          }
        }
      }, 1000);
   }
  }

recognition.onresult = async (e)=>{
  const transcript = e.results[e.results.length-1][0].transcript.trim();
    console.log(transcript);
  if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
  setAiText("")
    setUserText(transcript)
  recognition.stop();
  isRecognizingRef.current = false;
  setListening(false);
  const data = await getGeminiResponse(transcript)
  handleCommand(data);
  setAiText(data.response)
  setUserText("");
  };
};

const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name} what can I help you with?`);
greeting.lang = 'hi-IN';

synth.speak(greeting);
console.log(greeting);

return ()=>{
  isMounted = false;
  clearTimeout(startTimeOut);
  recognition.stop();
  setListening(false);
  isRecognizingRef.current = false;
};

}, [])

  return (
    <div className='w-full h-[100vh]  bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center overflow-hidden flex-col gap-[15px]'>
 <FiMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=> setHam(true)}/>

 <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[30px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0" : "translate-x-full"} transition-transform`}>
 <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=> setHam(false)}/>

  <button className='min-w-[150px] h-[60px] mt-[30px] font-semibold bg-white  rounded-full cursor-pointer'onClick={handleLogout}>Log Out </button>
     <button className='min-w-[150px] h-[60px] mt-[30px] font-semibold bg-white rounded-full px-[20px] py-[20px] cursor-pointer' onClick={()=> navigate("/customize")}> Customize your Assistant</button>
 
 <div className='w-full h-[2px] bg-gray-400 '>
 <h1 className='text-white font-semibold text-[30px]'>History</h1>

 <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
     {userData.history?.map((his, id)=>(
      
      <div className='text-gray-200 text-[18px] w-full h-[30px] font-semibold' key={id}>{his} </div>
     ))}
 </div>
 </div>
 </div>
   <button className='min-w-[150px] h-[60px] mt-[30px] hidden lg:block font-semibold bg-white absolute top-[20px] right-[20px] rounded-full cursor-pointer'onClick={handleLogout}>Log Out </button>
     <button className='min-w-[150px] h-[60px] mt-[30px] hidden lg:block font-semibold bg-white absolute rounded-full top-[100px] right-[20px] px-[20px] py-[20px] cursor-pointer' onClick={()=> navigate("/customize")}> Customize your Assistant</button>
     <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden  rounded-4xl shadow-lg'>
<img src={userData?.assistantImage} className='h-full object-cover'/>
     </div>
     <h1 className='text-white'>I'm {userData?.assistantName} </h1>
     {!aiText &&  <img src={userImg}  className='w-[200px]'/>}
     {aiText &&  <img src={aiImg}  className='w-[200px]'/>}
     
     <h1 className='text-white text-[20px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
    </div>
    
  )
}

export default Home
