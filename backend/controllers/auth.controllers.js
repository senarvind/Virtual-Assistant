import User from "../models/user.model.js";
import getToken from "../config/token.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res)=>{
    try {
        const{name, email, password} = req.body;
        const existEmail = await User.findOne({email});
        if(existEmail){
        return res.status(400).json({message : "email already exist !"})
        }

        if(password.length<6){
            return res.status(400).json({message : "password must be at least 6 character!"})
        }

        const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        password:hashPassword,
        email
    })
    
    const token = await getToken(user._id)
    
    res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  sameSite: "None",
  secure: true
});

    return res.status(201).json(user);

    } catch (error) {
        return res.status(201).json({message : `sign up error ${error}`});
    }
}

export const Login = async (req, res)=>{
    try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  
    const token = await getToken(user._id);

    // 4️⃣ Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    });

    res.status(201).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export  const Logout = async (req, res)=>{
    try {
        res.clearCookies("token")
        return res.status(200).json({message : "logout successfully"})
      } catch (error) {
        return res.status(500).json({message : `logout up error ${error}`});
    }
      }
