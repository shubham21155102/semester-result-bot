const mongoose=require("mongoose");
const sidSchema=new mongoose.Schema({
    roll:{
        type:String,
        required:true,
        unique:true,
    },
    sid:{
        type:String,
        required:true,
        unique:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
});
const sidModel=mongoose.model('sid',sidSchema);
module.exports=sidModel;