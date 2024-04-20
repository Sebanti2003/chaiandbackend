import User from "../models/user.model.js";
import { uploadoncloudinery } from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";
const generateAccessTokenandrefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accesstoken=user.generateAccessToken();
        const refreshtoken=user.generateRefreshToken();
        user.refreshToken=refreshtoken;
        await user.save({validateBeforeSave:false});
        return {accesstoken,refreshtoken};
    } catch (error) {
        console.log(error);
    }
}
export const registerUser = async (req, res,next) => {
    try {
        const {username,email,fullName,password} = req.body
        // console.log(username,email,fullName,password);
        if(!email){
            return res.status(400).json({message:"Email is required",})
        }
        if(!username){
            return res.status(400).json({message:"Username is required",})
        }
        if(!username || !email || !fullName || !password){
            return res.status(400).json({message:"All fields are required",})
        }

        const existinguser=await User.findOne({
            $or:[
                {username},
                {email}
            ],
        });
        if(existinguser){
            return res.status(409).json({message:"User already exists",})
        }
        const avatarfilepath=req?.files?.avatar[0]?.path;
        const coverfilepath=req?.files?.coverImage[0]?.path;
        if(!avatarfilepath){
            return res.status(400).json({message:"Avatar is required",})
        }
        const avatar=await uploadoncloudinery(avatarfilepath);
        if(!coverfilepath){
            return res.status(400).json({message:"Cover image is required",})
        }
        const coverImage=await uploadoncloudinery(coverfilepath);
        const createuser=await User.create({
            username,
            email,
            fullName,
            password,
            avatar:avatar.url,
            coverImage:coverImage.url||"",
        })
        const foundornot=await User.findById(createuser._id).select("-password -createdAt -updatedAt -__v -refreshToken");
        if(!foundornot){
            res.status(502).json({message:"Something went wrong in registering the user"})
        }
        return res.status(200).json({message:"User created successfully",person:foundornot});
        
            
    } catch (error) {
        console.log("erorrrrr",error);
    }
}
export const loginUser = async (req, res,next) => {
    try {
        const {email,password}=req.body;
        if(!email){
            return res.status(400).json({message:"Email is required",})
        }
        if(!password){
            return res.status(400).json({message:"Password is required",})
        }
        const founduser=await User.findOne({email});
        if(!founduser){
            return res.status(404).json({message:"User not found",})
        }
        const isMatch=await founduser.correctPassword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials",})
        }
        
        //access and refresh token
        const {accesstoken,refreshtoken}=await generateAccessTokenandrefreshToken(founduser._id);
        const foundornot=await User.findById(founduser._id).select("-password -createdAt -updatedAt -__v -refreshToken");
        const options={
            secure:true,
            httpOnly:true,
        }
        return res.status(200).cookie("access_token",accesstoken,options).cookie("refresh_token",refreshtoken,options).json({message:"Login successful",person:foundornot});
    } catch (error) {
        console.log("login has some problem on the logincontroller",error);
    }
    
}
export const logoutuser=async(req,res,next)=>{
    try {
       await User.findByIdAndUpdate(req?.user?._id,
    {
        $set:{refreshToken:undefined}
    },{
        new:true
    });
    const options={
        secure:true,
        httpOnly:true,
    };
    return res.status(200).clearCookie("access_token",options).clearCookie("refresh_token",options).json({message:"Logout successful"});
    }catch (error) {
        console.log(error);
    }
}
export const refresh_access_token=async(req,res,next)=>{
    try {
        const refreshtoken=req?.cookies?.refresh_token||req.body.refresh_token;
        if(!refreshtoken){
            return res.status(401).json({message:"Refresh token is required",})
        }
        const dec=jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);
        const founduser=await User.findById(dec?._id);
        if(!founduser){
            return res.status(401).json({message:"User not found",})
        }
        if(refreshtoken!==founduser?.refreshToken){
            return res.status(401).json({message:"Invalid refresh token",})
        }
        const {accesstokenn,refreshtoken:newrefresh}=await generateAccessTokenandrefreshToken(founduser?._id)
        res.status(200).cookie("access_token",accesstokenn,{
            secure:true,
            httpOnly:true,
        }).cookie("refresh_token",newrefresh,{
            secure:true,
            httpOnly:true,
        }).json({
            message:"acess token refreshed successful",
            person:founduser
        })
        }catch
        (error) {
        console.log(error);
        res.status(401).json({message:"Invalid refresh token",})
    }
}