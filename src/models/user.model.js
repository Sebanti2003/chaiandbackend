import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userschema=new mongoose.Schema({
    watchhistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
    }],
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String
    },
    coverImage:{
        type:String
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});
userschema.methods.correctPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
userschema.methods.generateAccessToken=async function(){
    return jwt.sign({_id:this._id,email:this.email,username:this.username,fullName:this.fullName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}
userschema.methods.generateRefreshToken=async function(){
    return jwt.sign({_id:this._id,},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}
userschema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})
const User=mongoose.model('User',userschema);
export default User