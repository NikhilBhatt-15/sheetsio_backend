import { TryCatch } from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import {ErrorHandler,getTokenFromHeader} from "../utils/utility.js";



const AuthMiddleware = TryCatch(async(req,res,next)=>{
    const token = getTokenFromHeader(req);
    console.log(token);
    if(!token){
        return next(new ErrorHandler("Not Authorized",401));
    }

    const decode = jwt.verify(token,process.env.jwt_secret);
    if(!decode){
        return next(new ErrorHandler("Invalid token",401));
    }
    const user = await User.findById(decode.id);
    if(!user){
        return next(new ErrorHandler("Not Authorized",401));
    }
    req.user  = user;
    next();
})

export {AuthMiddleware};