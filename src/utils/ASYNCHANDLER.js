const asynchandler=(fn)=>async(req,res,next)=>{
    try {
        fn();
    } catch (error) {
        res.status(500).json({message:error.message,statuscode:500})
    }
}
export default asynchandler