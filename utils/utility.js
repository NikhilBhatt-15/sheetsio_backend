import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const CookieOptions = {
    maxAge: 24*60*60*1000,
    httpOnly:true,
    sameSite:"none",
    secure:true
}


const connectDB = (uri,dbName)=>{
    mongoose.connect(uri,{dbName:dbName})
    .then(()=>{
        console.log("Connected to DB")
    })
    .catch((err)=>{
        throw err;
    });
}


const sendToken = (res,user,statusCode,message)=>{
    const token  = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: 1000*60*60*24
    });


    res.status(statusCode).cookie("user-token",token,CookieOptions).json({
        success:true,
        user,
        token,
        message
    });

}


export {connectDB,sendToken};