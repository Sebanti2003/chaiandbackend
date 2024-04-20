import mongoose from "mongoose";
export const ConnectDB=async()=>{
    try {
       const conn=await mongoose.connect(process.env.MONGO_URL)
       console.log("MongoDB Connected",conn.connection.host); 
    } catch (error) {
        console.log("MongoDB connection Failed",error);
        process.exit(1);
    }
}
