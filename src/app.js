import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
//WE ARE SETTING THE AMOUNT OF DATA THAT ONE COULD SEND TO THE SERVER THROUGH POST REQUEST AND IN THE JSON FORMAT AND THATS WHY WE HAVE A LIMIT OF 16kb FOR THAT 
app.use(express.json({limit:"16kb"}));
//URLENCODDED IS USED TO KNOW THAT WE ARE USING URL ENCODED
app.use(express.urlencoded({extended:true,limit:"16kb"}));
//WHEN WE WANT TO USE STATIC FILES
app.use(express.static("public"));
//WE ARE SETTING THE CORS_ORIGIN TO THE ENVIRONMENT VARIABLE
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
));
//
app.use(cookieParser()); 




import userroutes from './routes/user.route.js'
app.use('/api/user',userroutes);
export default app