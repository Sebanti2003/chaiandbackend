import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoschema=new mongoose.Schema({
    videofile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:[true,"thumbnail is required"]
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"owner is required"]
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:String
    },
    ispublished:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
videoschema.plugin(mongooseAggregatePaginate);
const Video = mongoose.model("Video",videoschema);

export default Video
