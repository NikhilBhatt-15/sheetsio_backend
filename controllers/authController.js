import { compare } from "bcrypt";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { User } from "../models/UserModel.js";
import { ErrorHandler } from "../utils/utility.js";
import { passwordValidator,emailValidator,nameValidator,sendToken } from "../utils/utility.js";

const register = TryCatch(async(req,res,next)=>{
    console.log(req.body);
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    if(!emailValidator(email)){
        return next(new ErrorHandler("Invalid email",400));
    }
    if(!passwordValidator(password)){
        return next(new ErrorHandler("Password must be at least 6 characters",400));
    }
    if(!nameValidator(name)){
        return next(new ErrorHandler("Name must be at least 3 characters",400));
    }
    const userExist = await User.findOne({
        email:email
    })
    if(userExist){
        return next(new ErrorHandler("User already exists",400));
    }
    const user = await User.create({
        name,
        email,
        password
    });
    sendToken(res,{
        name: user.name,
        email: user.email,
    },200,"User registered successfully");
})

const login = TryCatch(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const user = await User.findOne({
        email:email
    })
    if(!user){
        return next(new ErrorHandler("Invalid credentials",400));
    }
    const isMatch = await  compare(password,user.password);
    if(!isMatch){
        return next(new ErrorHandler("Invalid credentials",400));
    }
    sendToken(res,user,200,"User logged in successfully");
})

const logout = TryCatch(async (req,res,next)=>{
    res.cookie("user-token","none",{
        expires:new Date(Date.now()),
        httpOnly:true,
        sameSite: "None", // SameSite attribute set to none
        secure: true// Secure in production
    
    });
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
});

export {register,logout,login};