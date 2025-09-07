
import User from "../models/user.model.js";
 import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js";
import { json, response } from "express";
import moment from "moment";

// ------------------- Get Current User -------------------
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
    
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Error fetching current user" });
  }
};

// ------------------- Update Assistant -------------------
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    // Determine assistantImage (file upload OR direct URL)
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    if (!assistantName || !assistantImage) {
      return res.status(400).json({
        message: "assistantName and assistantImage are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Error updating assistant" });
  }
};

export const AskToAssistant = async (req, res)=>{
  try {
  const {command} = req.body;
  const user = await User.findById(req.userId);
  user.history.push(command)
  user.save()
  const userName = user.name;
  const assistantName = user.assistantName;
  const result = await geminiResponse(command, assistantName, userName)

  const JsonMatch= result.match(/{[\s\S]*}/)
  if(!JsonMatch){
    return res.status(400).json({response :"Sorry, i can't understand"})
  }
 
  const gemResult = JSON.parse(JsonMatch[0])
  const type = gemResult.type;

  switch(type){

    case 'get-date':
      return res.json({
        type,
        userInput: gemResult.userInput,
        response:`current date is ${moment().format("YYYY-MM-DD")}`
      });

      case 'get-time':
      return res.json({
        type,
        userInput: gemResult.userInput,
        response:`current time is ${moment().format("hh:mm A")}`
      });

      case 'get-day':
      return res.json({
        type,
        userInput: gemResult.userInput,
        response:`today is ${moment().format("dddd")}`
      });

       case 'get-month':
      return res.json({
        type,
        userInput: gemResult.userInput,
        response:`today is ${moment().format("MMMM")}`
      });

      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'linkedln-open':
      case 'weather-show':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:gemResult.response,
        });
        default :
        return res.status(400).json({response:"I didn't understand that command."})
  }

} catch (error) {
     return res.status(500).json({response:"ask assistant error"})
  }
}
