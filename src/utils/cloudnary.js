import {v2 as cloudinary} from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs";
configDotenv();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINERY_CLOUD_NAME, 
  api_key: process.env.CLOUDINERY_API_KEY, 
  api_secret: process.env.CLOUDINERY_API_SECRET
});
const uploadoncloudinery=async(localfilepath)=>{
    try {
        if(!localfilepath){
            throw new Error("localfilepath is required");
        }
        const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto",
        });
        fs.unlinkSync(localfilepath);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        console.log("file is not uploaded on cloudinery",error);
    }
}
export {uploadoncloudinery}