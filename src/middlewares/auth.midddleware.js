import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const verifyJWT=async(err,req,res,next)=>{
    try {
       const token=req.cookies?.access_token||req.header("Authorization")?.split(" ")[1];
       if(!token){
           return res.status(401).json({message:"Unauthorized user",statuscode:401});
       }
       const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const per=await User.findById(decodedtoken?._id).select("-password -createdAt -updatedAt -__v -refreshToken");
       if(!per){
           return res.status(401).json({message:"Access token rejected",statuscode:401});
       }
       req.user=per;
       next();
    } catch (error) {
        console.log(error);
    }
}
