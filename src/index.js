
import {configDotenv} from "dotenv";
import { ConnectDB } from "./db/connection.js";
configDotenv();
import app from "./app.js";
//database integretion
ConnectDB();
//creation of our server
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is listening and running on port ${port}`);
})
