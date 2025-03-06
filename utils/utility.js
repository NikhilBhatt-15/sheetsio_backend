import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const CookieOptions = {
    maxAge: 24*60*60*1000,
    httpOnly:true,
    sameSite:"none",
    secure:true
}

class ErrorHandler extends Error {
    constructor(message,statusCode) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
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

    console.log(token);
    res.status(statusCode).cookie("user-token",token,CookieOptions).json({
        success:true,
        user,
        token,
        message
    });

}

const getTokenFromHeader = (req)=>{
    const authorization = req.headers.authorization;
    if(authorization && authorization.startsWith('Bearer')){
        return authorization.split(' ')[1];
    }
    return null;
}

const passwordValidator = (password)=>{
    // password should not have spaces
    if(password.length<6 || password.includes(" ")){
        return false;
    }
    return true;
}

const emailValidator = (email)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return false;
    }
    return true;
}

const nameValidator = (name)=>{
    if(name.length<3 || name.includes(" ")){
        return false;
    }
    return true;
}

export {connectDB,sendToken,ErrorHandler,getTokenFromHeader,passwordValidator,emailValidator,nameValidator};